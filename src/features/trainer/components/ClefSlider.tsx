import React from 'react'
import './ClefSlider.css'

interface ClefSliderProps {
  value: number // 0 = all fa, 1 = all sol
  onChange: (value: number) => void
  disabled?: boolean
}

const STEPS = [0, 0.25, 0.5, 0.75, 1]

// SMuFL codepoints
const CLEF_G = '\uE050'
const CLEF_F = '\uE062'

export const ClefSlider: React.FC<ClefSliderProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const stepIndex = STEPS.findIndex((s) => Math.abs(s - value) < 0.01)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const idx = parseInt(e.target.value, 10)
    onChange(STEPS[idx])
  }

  const getLabel = () => {
    if (value === 0) return '100% Fa'
    if (value === 1) return '100% Sol'
    if (value === 0.5) return '50/50'
    if (value < 0.5) return `${Math.round((1 - value) * 100)}% Fa`
    return `${Math.round(value * 100)}% Sol`
  }

  return (
    <div className="clef-slider">
      <div className="clef-slider__header">
        <span className="clef-slider__label">Sleutel</span>
        <span className="clef-slider__value">{getLabel()}</span>
      </div>
      
      <div className="clef-slider__track-container">
        <span className="clef-slider__icon">{CLEF_F}</span>
        <input
          type="range"
          min="0"
          max="4"
          step="1"
          value={stepIndex >= 0 ? stepIndex : 2}
          onChange={handleChange}
          disabled={disabled}
          className="clef-slider__input"
          aria-label="Sleutelverdeling"
        />
        <span className="clef-slider__icon">{CLEF_G}</span>
      </div>
    </div>
  )
}
