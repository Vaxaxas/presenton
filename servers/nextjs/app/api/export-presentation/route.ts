import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import os from "os";

import {
  BundledPresentationExportFormat,
  bundledExportPackageAvailable,
  runBundledPresentationExport,
} from "@/lib/run-bundled-presentation-export";
import { authStatusForRequest } from "@/lib/server-auth-role";

function isValidFormat(value: unknown): value is BundledPresentationExportFormat {
  return value === "pdf" || value === "pptx";
}

async function readExportRequestBody(req: NextRequest): Promise<{
  format?: unknown;
  id?: unknown;
  title?: unknown;
}> {
  const rawBody = await req.text();
  if (!rawBody.trim()) {
    throw new Error("EMPTY_BODY");
  }

  const parsed = JSON.parse(rawBody) as unknown;
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("INVALID_BODY");
  }

  return parsed as { format?: unknown; id?: unknown; title?: unknown };
}

async function buildExportDownloadUrl(outPath: string): Promise<string> {
  const appDataDirectory =
    process.env.APP_DATA_DIRECTORY?.trim() ||
    path.join(os.tmpdir(), "presenton");

  const exportsDirectory = path.join(appDataDirectory, "exports");
  await fs.mkdir(exportsDirectory, { recursive: true });
  let relativePath = path.relative(exportsDirectory, outPath);
  if (
    !relativePath ||
    relativePath.startsWith("..") ||
    path.isAbsolute(relativePath)
  ) {
    const dest = path.join(exportsDirectory, path.basename(outPath));
    await fs.copyFile(outPath, dest);
    relativePath = path.basename(dest);
  }

  const urlSafePath = relativePath.split(path.sep).join("/");
  return `/api/export-presentation/file?name=${encodeURIComponent(urlSafePath)}`;
}

async function moveExportIntoOwnerDirectory(
  outPath: string,
  userId: string | null
): Promise<string> {
  if (!userId) {
    return outPath;
  }

  const appDataDirectory =
    process.env.APP_DATA_DIRECTORY?.trim() ||
    path.join(os.tmpdir(), "presenton");

  const exportsDirectory = await fs.realpath(
    path.join(appDataDirectory, "exports")
  );
  const sourcePath = await fs.realpath(outPath);
  const ownerDirectory = path.join(exportsDirectory, "users", userId);
  await fs.mkdir(ownerDirectory, { recursive: true });

  const sourceParent = path.dirname(sourcePath);
  if (sourceParent === ownerDirectory) {
    return sourcePath;
  }
  const relativeSource = path.relative(exportsDirectory, sourcePath);
  if (
    !relativeSource ||
    relativeSource.startsWith("..") ||
    path.isAbsolute(relativeSource) ||
    relativeSource.split(path.sep)[0] === "users"
  ) {
    const destination = path.join(ownerDirectory, path.basename(sourcePath));
    await fs.copyFile(sourcePath, destination);
    return destination;
  }

  const destination = path.join(ownerDirectory, path.basename(sourcePath));
  await fs.rename(sourcePath, destination);
  return destination;
}

export async function POST(req: NextRequest) {
  const auth = await authStatusForRequest(req);
  if (!auth.authenticated) {
    return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  }

  let body: Awaited<ReturnType<typeof readExportRequestBody>>;
  try {
    body = await readExportRequestBody(req);
  } catch (error) {
    if (
      error instanceof SyntaxError ||
      (error instanceof Error &&
        (error.message === "EMPTY_BODY" || error.message === "INVALID_BODY"))
    ) {
      return NextResponse.json(
        { error: "Invalid export request JSON body" },
        { status: 400 }
      );
    }
    throw error;
  }

  const { format, id, title } = body;
  const cookieHeader = req.headers.get("cookie") ?? "";

  if (typeof id !== "string" || !id.trim()) {
    return NextResponse.json(
      { error: "Missing Presentation ID" },
      { status: 400 }
    );
  }

  if (!isValidFormat(format)) {
    return NextResponse.json(
      { error: "Invalid export format" },
      { status: 400 }
    );
  }

  try {
    if (!(await bundledExportPackageAvailable())) {
      throw new Error(
        "presentation-export runtime is not available. Run scripts/sync-presentation-export.cjs to install it."
      );
    }

    const requestHost = req.headers.get("host");
    const requestProto = req.headers.get("x-forwarded-proto") || "http";
    const requestOrigin = requestHost ? `${requestProto}://${requestHost}` : undefined;

    const { path: unscopedOutPath } = await runBundledPresentationExport({
      format,
      presentationId: id.trim(),
      title: typeof title === "string" ? title : undefined,
      cookieHeader,
      baseUrl: requestOrigin,
    });
    const outPath = await moveExportIntoOwnerDirectory(
      unscopedOutPath,
      auth.user_id
    );

    return NextResponse.json({
      success: true,
      path: await buildExportDownloadUrl(outPath),
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error(`[export-presentation:${format}]`, message);
    return NextResponse.json(
      { error: message, success: false },
      { status: 500 }
    );
  }
}
