import React, { forwardRef } from 'react'
import { classNames } from '@/utils'
import { useUncontrolled } from '@/hooks/use-uncontrolled'
import { Dropdown } from '../Dropdown'
import { ResizeProps, ResizeScale, ResizeItemProps } from './Resize.types'

const DEFAULT_LABELS = {
  sm: '작게',
  md: '보통',
  lg: '조금 크게',
  xlg: '크게',
  xxlg: '가장크게'
}

const ResizeItem: React.FC<ResizeItemProps> = ({ scale, label, isActive, onClick }) => {
  const handleClick = () => {
    onClick(scale)
  }

  return (
    <Dropdown.Item className={classNames(scale, isActive && 'active')} data-adjust-scale={scale} isActive={isActive} onClick={handleClick}>
      {label}
    </Dropdown.Item>
  )
}

/**
 * KRDS Resize Component
 * @param value 현재 선택된 크기 ('sm' | 'md' | 'lg' | 'xlg' | 'xxlg')
 * @param defaultValue 기본 선택된 크기
 * @param onChange 크기 변경 시 호출되는 콜백 함수
 * @param buttonText 드롭다운 버튼 텍스트
 * @param resetText 초기화 버튼 텍스트
 * @param labels 각 크기 옵션의 라벨
 * @param className 사용자 정의 클래스명
 */
export const Resize = forwardRef<HTMLButtonElement, ResizeProps>(
  (
    { value, defaultValue = 'md', onChange, buttonText = '화면크기', resetText = '초기화', labels = DEFAULT_LABELS, className, ...rest },
    ref
  ) => {
    const [currentScale, setCurrentScale] = useUncontrolled({
      value,
      defaultValue,
      finalValue: 'md' as ResizeScale,
      onChange
    })

    const handleScaleChange = (scale: ResizeScale) => {
      setCurrentScale(scale)

      const root = document.querySelector(':root') as HTMLElement
      if (root) {
        const rootStyles = getComputedStyle(root)
        let zoomValue = ''

        switch (scale) {
          case 'sm':
            zoomValue = rootStyles.getPropertyValue('--krds-zoom-small').trim()
            break
          case 'md':
            zoomValue = rootStyles.getPropertyValue('--krds-zoom-medium').trim()
            break
          case 'lg':
            zoomValue = rootStyles.getPropertyValue('--krds-zoom-large').trim()
            break
          case 'xlg':
            zoomValue = rootStyles.getPropertyValue('--krds-zoom-xlarge').trim()
            break
          case 'xxlg':
            zoomValue = rootStyles.getPropertyValue('--krds-zoom-xxlarge').trim()
            break
        }

        if (zoomValue) {
          document.body.style.zoom = zoomValue
        }
      }

      onChange?.(scale)
    }

    const handleReset = () => {
      handleScaleChange('md')
    }

    const scales: ResizeScale[] = ['sm', 'md', 'lg', 'xlg', 'xxlg']

    const buttonContent = (
      <>
        {buttonText} <i className="svg-icon ico-toggle"></i>
      </>
    )

    const bottomContent = (
      <button type="button" className="krds-btn medium text" data-adjust-scale="md" onClick={handleReset}>
        <i className="svg-icon ico-reset"></i> {resetText}
      </button>
    )

    return (
      <Dropdown buttonText={buttonContent} className={classNames('krds-resize', className)} ref={ref} {...rest}>
        <Dropdown.List>
          {scales.map(scale => (
            <ResizeItem key={scale} scale={scale} label={labels[scale]} isActive={currentScale === scale} onClick={handleScaleChange} />
          ))}
        </Dropdown.List>
        <Dropdown.BottomSection>{bottomContent}</Dropdown.BottomSection>
      </Dropdown>
    )
  }
)

Resize.displayName = 'Resize'
