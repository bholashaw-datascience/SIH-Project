import { useState, useRef } from 'react'
import './ImageCropModal.css'

function ImageCropModal({
  isOpen,
  imageSrc,
  fileName,
  onCancel,
  onApply,
  title = 'Crop & Position Profile Photo',
  subtitle = 'Drag to reposition, use slider to zoom',
  roleBadge = 'PHOTO ADJUSTMENT',
}) {
  const [cropZoom, setCropZoom] = useState(1)
  const [cropPan, setCropPan] = useState({ x: 0, y: 0 })
  const [cropNaturalSize, setCropNaturalSize] = useState({ width: 0, height: 0 })
  const cropImgRef = useRef(null)
  const isDraggingRef = useRef(false)
  const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 })

  const CROP_FRAME_SIZE = 220

  const [prevOpenSrc, setPrevOpenSrc] = useState({ isOpen, imageSrc })
  if (isOpen !== prevOpenSrc.isOpen || imageSrc !== prevOpenSrc.imageSrc) {
    setPrevOpenSrc({ isOpen, imageSrc })
    if (isOpen) {
      setCropZoom(1)
      setCropPan({ x: 0, y: 0 })
    }
  }

  if (!isOpen || !imageSrc) return null

  const handleImageLoaded = (e) => {
    const { naturalWidth, naturalHeight } = e.target
    setCropNaturalSize({ width: naturalWidth, height: naturalHeight })
    setCropZoom(1)
    setCropPan({ x: 0, y: 0 })
  }

  const baseScale =
    cropNaturalSize.width && cropNaturalSize.height
      ? Math.max(
          CROP_FRAME_SIZE / cropNaturalSize.width,
          CROP_FRAME_SIZE / cropNaturalSize.height
        )
      : 1
  const cropEffectiveScale = baseScale * cropZoom

  const maxPanX = Math.max(0, (cropNaturalSize.width * cropEffectiveScale - CROP_FRAME_SIZE) / 2)
  const maxPanY = Math.max(0, (cropNaturalSize.height * cropEffectiveScale - CROP_FRAME_SIZE) / 2)

  const clampPan = (x, y) => ({
    x: Math.max(-maxPanX, Math.min(maxPanX, x)),
    y: Math.max(-maxPanY, Math.min(maxPanY, y)),
  })

  // Mouse Drag handlers
  const handleMouseDown = (e) => {
    isDraggingRef.current = true
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: cropPan.x,
      panY: cropPan.y,
    }
  }

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return
    const dx = e.clientX - dragStartRef.current.x
    const dy = e.clientY - dragStartRef.current.y
    setCropPan(clampPan(dragStartRef.current.panX + dx, dragStartRef.current.panY + dy))
  }

  const handleMouseUp = () => {
    isDraggingRef.current = false
  }

  // Touch Drag handlers
  const handleTouchStart = (e) => {
    if (e.touches.length !== 1) return
    isDraggingRef.current = true
    dragStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      panX: cropPan.x,
      panY: cropPan.y,
    }
  }

  const handleTouchMove = (e) => {
    if (!isDraggingRef.current || e.touches.length !== 1) return
    const dx = e.touches[0].clientX - dragStartRef.current.x
    const dy = e.touches[0].clientY - dragStartRef.current.y
    setCropPan(clampPan(dragStartRef.current.panX + dx, dragStartRef.current.panY + dy))
  }

  const handleTouchEnd = () => {
    isDraggingRef.current = false
  }

  const handleWheel = (e) => {
    e.preventDefault()
    const delta = e.deltaY < 0 ? 0.08 : -0.08
    setCropZoom((prev) => Math.max(1, Math.min(3, +(prev + delta).toFixed(2))))
  }

  const handleApplyClick = () => {
    if (!cropImgRef.current || !cropNaturalSize.width) return

    const canvas = document.createElement('canvas')
    const exportSize = 360
    canvas.width = exportSize
    canvas.height = exportSize
    const ctx = canvas.getContext('2d')

    // Position of crop frame center relative to image center in source image coordinates
    const sourceCropDiameter = CROP_FRAME_SIZE / cropEffectiveScale
    const sourceCenterX = cropNaturalSize.width / 2 - cropPan.x / cropEffectiveScale
    const sourceCenterY = cropNaturalSize.height / 2 - cropPan.y / cropEffectiveScale
    const sourceX = sourceCenterX - sourceCropDiameter / 2
    const sourceY = sourceCenterY - sourceCropDiameter / 2

    ctx.drawImage(
      cropImgRef.current,
      sourceX,
      sourceY,
      sourceCropDiameter,
      sourceCropDiameter,
      0,
      0,
      exportSize,
      exportSize
    )

    const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.92)
    onApply(croppedDataUrl, fileName)
  }

  return (
    <div className="crop-modal-overlay" onClick={onCancel}>
      <div className="crop-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="crop-modal-top-accent"></div>
        <div className="crop-modal-header">
          <div>
            <span className="modal-role-pill">{roleBadge}</span>
            <h3 className="crop-modal-title">{title}</h3>
            <p className="crop-modal-subtitle">{subtitle}</p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onCancel}
            aria-label="Cancel crop"
          >
            ✕
          </button>
        </div>

        <div className="crop-modal-body">
          {/* Crop Viewport Area */}
          <div
            className="crop-viewport"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onWheel={handleWheel}
          >
            <img
              ref={cropImgRef}
              src={imageSrc}
              alt="Crop target"
              className="crop-target-img"
              onLoad={handleImageLoaded}
              draggable={false}
              style={{
                transform: `translate(-50%, -50%) translate(${cropPan.x}px, ${cropPan.y}px) scale(${cropEffectiveScale})`,
              }}
            />

            {/* Circular Crop Mask Overlay */}
            <div className="crop-circle-mask">
              <div className="crop-grid-lines">
                <div className="crop-grid-h"></div>
                <div className="crop-grid-v"></div>
              </div>
            </div>
          </div>

          {/* Zoom Controls */}
          <div className="crop-controls-strip">
            <button
              type="button"
              className="crop-zoom-btn"
              onClick={() => setCropZoom((prev) => Math.max(1, +(prev - 0.1).toFixed(2)))}
              aria-label="Zoom out"
            >
              −
            </button>
            <input
              type="range"
              min="1"
              max="3"
              step="0.02"
              value={cropZoom}
              onChange={(e) => setCropZoom(parseFloat(e.target.value))}
              className="crop-zoom-slider"
              aria-label="Zoom photo"
            />
            <button
              type="button"
              className="crop-zoom-btn"
              onClick={() => setCropZoom((prev) => Math.min(3, +(prev + 0.1).toFixed(2)))}
              aria-label="Zoom in"
            >
              +
            </button>
            <span className="crop-zoom-label">{Math.round(cropZoom * 100)}%</span>
            <button
              type="button"
              className="crop-reset-btn"
              onClick={() => {
                setCropZoom(1)
                setCropPan({ x: 0, y: 0 })
              }}
            >
              Reset
            </button>
          </div>
        </div>

        {/* Actions: Cancel & Apply */}
        <div className="crop-modal-footer">
          <button
            type="button"
            className="crop-btn-cancel"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="crop-btn-apply"
            onClick={handleApplyClick}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}

export default ImageCropModal
