import numpy as np
import matplotlib.pyplot as plt
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import cv2

# -------------------------------
# Load EfficientNetB0 model
# -------------------------------
MODEL_PATH = "C:\\Users\\dubba\\OneDrive\\Desktop\\Hackathon\\models\\stage_model.h5"
model = load_model(MODEL_PATH)

CLASS_LABELS = ["No DR", "Mild", "Moderate", "Severe", "Proliferative DR"]

# -------------------------------
# Load and preprocess the image
# -------------------------------
IMG_PATH = "C:\\Users\\dubba\\OneDrive\\Desktop\\Hackathon\\testimages\\0dbaa09a458c.png"
IMG_SIZE = (224, 224)  # EfficientNetB0 default input size

img = image.load_img(IMG_PATH, target_size=IMG_SIZE)
img_array = image.img_to_array(img)
img_array = np.expand_dims(img_array, axis=0)
# Use EfficientNet preprocessing
img_array = tf.keras.applications.efficientnet.preprocess_input(img_array)

# -------------------------------
# Make prediction
# -------------------------------
pred = model.predict(img_array)
predicted_class = np.argmax(pred)
predicted_label = CLASS_LABELS[predicted_class]
confidence = np.max(pred) * 100

print(f"\nPredicted Stage: {predicted_label} ({confidence:.2f}% confidence)\n")

# -------------------------------
# Grad-CAM for EfficientNetB0
# -------------------------------
# EfficientNetB0 last conv layer
last_conv_layer_name = "top_conv"  # default last conv layer in EfficientNetB0

grad_model = tf.keras.models.Model(
    [model.inputs],
    [model.get_layer(last_conv_layer_name).output, model.output]
)

with tf.GradientTape() as tape:
    conv_outputs, predictions = grad_model(img_array)
    loss = predictions[:, predicted_class]

grads = tape.gradient(loss, conv_outputs)[0]
pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
conv_outputs = conv_outputs[0]
heatmap = tf.reduce_mean(tf.multiply(pooled_grads, conv_outputs), axis=-1)
heatmap = np.maximum(heatmap, 0)
heatmap /= np.max(heatmap)  # normalize to [0,1]

# -------------------------------
# Superimpose heatmap on original image
# -------------------------------
img_orig = cv2.imread(IMG_PATH)
img_orig = cv2.resize(img_orig, IMG_SIZE)
heatmap = cv2.resize(heatmap.numpy(), (img_orig.shape[1], img_orig.shape[0]))
heatmap = np.uint8(255 * heatmap)
heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)

superimposed_img = cv2.addWeighted(img_orig, 0.6, heatmap, 0.4, 0)

# -------------------------------
# Plot results
# -------------------------------
plt.figure(figsize=(10,4))

plt.subplot(1,2,1)
plt.imshow(cv2.cvtColor(img_orig, cv2.COLOR_BGR2RGB))
plt.title(f"Predicted: {predicted_label}\n({confidence:.2f}% confidence)")
plt.axis('off')

plt.subplot(1,2,2)
plt.imshow(cv2.cvtColor(superimposed_img, cv2.COLOR_BGR2RGB))
plt.title("Grad-CAM Visualization")
plt.axis('off')

plt.tight_layout()
plt.show()
