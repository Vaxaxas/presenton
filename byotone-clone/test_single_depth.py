import cv2
import numpy as np
import torch
from PIL import Image
from transformers import pipeline

pipe = pipeline("depth-estimation", model="depth-anything/Depth-Anything-V2-Small-hf")
img = Image.open("sanity/new_video_frame.jpg").resize((518, 292))
res = pipe(img)
depth_raw = np.array(res["depth"])
depth_resized = cv2.resize(depth_raw, (1280, 720), interpolation=cv2.INTER_CUBIC)

orig_bgr = cv2.imread("sanity/new_video_frame.jpg")
orig_gray = cv2.cvtColor(orig_bgr, cv2.COLOR_BGR2GRAY)
bg_mask = np.clip((15.0 - orig_gray.astype(np.float32)) / 10.0, 0.0, 1.0)
cleaned_depth = (depth_resized.astype(np.float32) * (1.0 - bg_mask * 0.98)).astype(np.uint8)

depth_bgr = cv2.cvtColor(cleaned_depth, cv2.COLOR_GRAY2BGR)
sbs = np.hstack([orig_bgr, depth_bgr])
cv2.imwrite("sanity/sample_sbs_dino.jpg", sbs)
print("Saved sanity/sample_sbs_dino.jpg")
