import os
import sys
import time
import cv2
import numpy as np
import torch
from PIL import Image
from transformers import pipeline

def main():
    print("=== Depth-Anything RGB-D Video Generation ===")
    input_path = sys.argv[1] if len(sys.argv) > 1 else r"C:\Users\fi\Downloads\gemini_generated_video_0f0efe99.mp4"
    if not os.path.exists(input_path):
        input_path = r"C:\Users\fi\source\presenton\byotone-clone\assets\gemini_generated_video_0f0efe99.mp4"

    assets_dir = r"C:\Users\fi\source\presenton\byotone-clone\assets"
    os.makedirs(assets_dir, exist_ok=True)
    output_sbs = os.path.join(assets_dir, "dance-rgbd-sbs.mp4")
    output_depth = os.path.join(assets_dir, "dance-depth.mp4")
    temp_sbs_avi = os.path.join(assets_dir, "temp_sbs.mp4")
    temp_depth_avi = os.path.join(assets_dir, "temp_depth.mp4")

    # Open video
    cap = cv2.VideoCapture(input_path)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = cap.get(cv2.CAP_PROP_FPS) or 24.0
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    print(f"Input video: {input_path}")
    print(f"Resolution: {width}x{height}, FPS: {fps:.2f}, Total frames: {total_frames}")

    # Set CPU threads
    torch.set_num_threads(8)
    print("Loading Depth-Anything-V2-Small model...")
    pipe = pipeline('depth-estimation', model='depth-anything/Depth-Anything-V2-Small-hf')
    print("Model loaded successfully.")

    # Video writers
    # SBS resolution: (width * 2) x height = 2560 x 720
    sbs_width = width * 2
    sbs_height = height
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    writer_sbs = cv2.VideoWriter(temp_sbs_avi, fourcc, fps, (sbs_width, sbs_height))
    writer_depth = cv2.VideoWriter(temp_depth_avi, fourcc, fps, (width, height))

    batch_size = 4
    frame_idx = 0
    start_time = time.time()

    # Pre-read and process in batches
    frames_buffer = []
    pil_buffer = []

    def process_batch(frames, pils):
        results = pipe(pils)
        for orig_bgr, res in zip(frames, results):
            depth_img = res['depth']
            depth_raw = np.array(depth_img) # uint8 0..255 (292x518)
            # Resize depth map smoothly back to full frame (width x height)
            depth_np = cv2.resize(depth_raw, (width, height), interpolation=cv2.INTER_CUBIC)
            
            # Clean dark background halo so the 3D subject floats cleanly on paper ground
            orig_gray = cv2.cvtColor(orig_bgr, cv2.COLOR_BGR2GRAY)
            bg_mask = np.clip((24.0 - orig_gray.astype(np.float32)) / 18.0, 0.0, 1.0)
            cleaned_depth = (depth_np.astype(np.float32) * (1.0 - bg_mask * 0.96)).astype(np.uint8)
            depth_bgr = cv2.cvtColor(cleaned_depth, cv2.COLOR_GRAY2BGR)

            # SBS composition: [Left: RGB | Right: Depth Map]
            sbs_frame = np.hstack([orig_bgr, depth_bgr])
            writer_sbs.write(sbs_frame)
            writer_depth.write(depth_bgr)

    while True:
        ret, frame = cap.read()
        if not ret:
            break
        
        frames_buffer.append(frame)
        # Convert to PIL Image (RGB) for Depth-Anything
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        # Resize to 518x292 for fast Depth-Anything inference while preserving 16:9 aspect
        pil_img = Image.fromarray(rgb).resize((518, 292), Image.Resampling.BILINEAR)
        pil_buffer.append(pil_img)

        if len(frames_buffer) >= batch_size:
            process_batch(frames_buffer, pil_buffer)
            frame_idx += len(frames_buffer)
            elapsed = time.time() - start_time
            fps_proc = frame_idx / elapsed
            eta = (total_frames - frame_idx) / fps_proc if fps_proc > 0 else 0
            print(f"[{frame_idx}/{total_frames}] {fps_proc:.2f} fps | Elapsed: {elapsed:.1f}s | ETA: {eta:.1f}s", flush=True)
            frames_buffer.clear()
            pil_buffer.clear()

    if frames_buffer:
        process_batch(frames_buffer, pil_buffer)
        frame_idx += len(frames_buffer)
        print(f"[{frame_idx}/{total_frames}] Complete batch finished.", flush=True)

    cap.release()
    writer_sbs.release()
    writer_depth.release()

    total_time = time.time() - start_time
    print(f"Depth estimation complete in {total_time:.2f}s! Converting to optimized web H.264 mp4 via ffmpeg...")

    # Transcode with ffmpeg for fast web streaming (H.264 + faststart + yuv420p)
    cmd_sbs = f'ffmpeg -y -i "{temp_sbs_avi}" -c:v libx264 -preset fast -crf 20 -pix_fmt yuv420p -movflags +faststart "{output_sbs}"'
    cmd_depth = f'ffmpeg -y -i "{temp_depth_avi}" -c:v libx264 -preset fast -crf 20 -pix_fmt yuv420p -movflags +faststart "{output_depth}"'

    os.system(cmd_sbs)
    os.system(cmd_depth)

    # Clean temporary files
    if os.path.exists(temp_sbs_avi):
        os.remove(temp_sbs_avi)
    if os.path.exists(temp_depth_avi):
        os.remove(temp_depth_avi)

    print(f"=== Successfully generated {output_sbs} and {output_depth} ===")

if __name__ == "__main__":
    main()
