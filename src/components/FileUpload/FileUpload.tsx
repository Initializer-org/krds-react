import Button from '@/components/Button'
import Spinner from '@/components/Spinner'
import { useUncontrolled } from '@/hooks/use-uncontrolled'
import { classNames } from '@/utils'
import React, { forwardRef, useCallback, useId, useRef, useState } from 'react'
import { FileItem, FileUploadProps } from './FileUpload.types'

/**
 * KRDS FileUpload Component
 * @param title 타이틀 영역 제목
 * @param description 컨텐츠 영역 설명
 * @param uploadText 업로드 영역 안내 텍스트
 * @param maxFiles 최대 파일 개수
 * @param maxFileSize 최대 파일 크기 (bytes)
 * @param acceptedFileTypes 허용된 파일 확장자 배열
 * @param files 파일 목록
 * @param onFilesChange 파일 목록 변경 핸들러
 * @param onFileUpload 파일 업로드 핸들러
 * @param onFileDelete 파일 삭제 핸들러
 * @param onAllFilesDelete 전체 파일 삭제 핸들러
 * @param disabled 비활성화 상태
 * @param allowDelete 파일 삭제 허용 여부
 * @param className 커스텀 클래스명
 */
const FileUpload = forwardRef<HTMLDivElement, FileUploadProps>(
  (
    {
      title,
      description,
      uploadText = '첨부할 파일을 여기에 끌어다 놓거나, 파일 선택 버튼을 눌러 파일을 직접 선택해주세요.',
      maxFiles = 10,
      maxFileSize = 20 * 1024 * 1024,
      acceptedFileTypes,
      files: _files,
      onFilesChange,
      onFileUpload,
      onFileDelete,
      onAllFilesDelete,
      disabled = false,
      allowDelete = true,
      className = '',
      children,
      ...restProps
    },
    ref
  ) => {
    const [files, setFiles] = useUncontrolled<FileItem[]>({
      value: _files,
      defaultValue: [],
      onChange: onFilesChange,
      finalValue: []
    })
    const [isDragActive, setIsDragActive] = useState(false)
    const fileInputId = useId()
    const fileInputRef = useRef<HTMLInputElement | null>(null)

    const formatFileSize = useCallback((bytes: number): string => {
      if (bytes === 0) return '0B'
      const k = 1024
      const sizes = ['B', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + sizes[i]
    }, [])

    const getFileExtension = useCallback((filename: string): string => {
      return filename.split('.').pop()?.toLowerCase() || ''
    }, [])

    const validateFile = useCallback(
      (file: File): { isValid: boolean; errorMessage?: string } => {
        if (file.size > maxFileSize) {
          return {
            isValid: false,
            errorMessage: `등록 가능한 파일 용량을 초과하였습니다.\n${formatFileSize(maxFileSize)} 미만의 파일만 등록할 수 있습니다.`
          }
        }

        if (acceptedFileTypes?.length) {
          const extension = getFileExtension(file.name)
          if (!acceptedFileTypes.includes(extension)) {
            return {
              isValid: false,
              errorMessage: `지원하지 않는 파일 형식입니다.\n${acceptedFileTypes.join(', ')} 형식만 업로드 가능합니다.`
            }
          }
        }

        return { isValid: true }
      },
      [maxFileSize, acceptedFileTypes, formatFileSize, getFileExtension]
    )

    const processFiles = useCallback(
      async (selectedFiles: FileList) => {
        const newFiles: FileItem[] = []
        const availableSlots = maxFiles - files.length
        const filesToProcess = Math.min(selectedFiles.length, availableSlots)

        for (let i = 0; i < filesToProcess; i++) {
          const file = selectedFiles[i]
          const validation = validateFile(file)

          const fileItem: FileItem = {
            id: `${Date.now()}-${i}`,
            name: file.name,
            size: file.size,
            type: getFileExtension(file.name),
            status: validation.isValid ? 'ready' : 'error',
            errorMessage: validation.errorMessage
          }

          newFiles.push(fileItem)

          if (validation.isValid && onFileUpload) {
            try {
              fileItem.status = 'uploading'
              await onFileUpload(file)
              fileItem.status = 'completed'
            } catch {
              fileItem.status = 'error'
              fileItem.errorMessage = '파일 업로드에 실패했습니다.'
            }
          }
        }

        if (newFiles.length > 0) {
          setFiles([...files, ...newFiles])
        }
      },
      [files, maxFiles, validateFile, getFileExtension, onFileUpload, setFiles]
    )

    const handleFileSelect = useCallback(
      (selectedFiles: FileList | null) => {
        if (selectedFiles?.length) {
          processFiles(selectedFiles)
        }
      },
      [processFiles]
    )

    const handleInputChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        handleFileSelect(event.target.files)
        event.target.value = ''
      },
      [handleFileSelect]
    )

    const handleDragOver = useCallback(
      (event: React.DragEvent) => {
        event.preventDefault()
        if (!disabled) {
          setIsDragActive(true)
        }
      },
      [disabled]
    )

    const handleDragLeave = useCallback((event: React.DragEvent) => {
      event.preventDefault()
      setIsDragActive(false)
    }, [])

    const handleDrop = useCallback(
      (event: React.DragEvent) => {
        event.preventDefault()
        setIsDragActive(false)
        if (!disabled) {
          handleFileSelect(event.dataTransfer.files)
        }
      },
      [disabled, handleFileSelect]
    )

    const handleFileDelete = useCallback(
      (fileId: string) => {
        if (onFileDelete) {
          onFileDelete(fileId)
        } else {
          onFilesChange?.(files.filter(file => file.id !== fileId))
        }
      },
      [files, onFileDelete, onFilesChange]
    )

    const handleAllFilesDelete = useCallback(() => {
      if (onAllFilesDelete) {
        onAllFilesDelete()
      } else {
        onFilesChange?.([])
      }
    }, [onAllFilesDelete, onFilesChange])

    const renderFileStatus = (file: FileItem) => {
      switch (file.status) {
        case 'uploading':
          return (
            <span role="status">
              <Spinner />
              <span className="sr-only">업로드 중</span>
            </span>
          )
        case 'completed':
          return (
            <span className="ico-invalid complete">
              <em className="sr-only">업로드 완료</em>
            </span>
          )
        default:
          return null
      }
    }

    const renderFileActions = (file: FileItem) => {
      if (file.status === 'uploading') return null

      if (!allowDelete) return null

      if (file.onDownload || file.onPreview) {
        return (
          <>
            {file.onDownload && (
              <Button variant="text" size="medium" onClick={file.onDownload} disabled={disabled}>
                다운로드 <i className="svg-icon ico-down"></i>
              </Button>
            )}
            {file.onPreview && (
              <Button variant="text" size="medium" onClick={file.onPreview} disabled={disabled}>
                바로보기 <i className="svg-icon ico-angle right"></i>
              </Button>
            )}
            {file.deletable !== false && (
              <Button variant="text" size="medium" onClick={() => handleFileDelete(file.id)} disabled={disabled}>
                삭제 <i className="svg-icon ico-delete-fill"></i>
              </Button>
            )}
          </>
        )
      }

      if (file.deletable === false) return null

      return (
        <Button variant="text" size="medium" onClick={() => handleFileDelete(file.id)} disabled={disabled}>
          삭제 <i className="svg-icon ico-delete-fill"></i>
        </Button>
      )
    }

    return (
      <div ref={ref} className={classNames('krds-file-upload line', className)} {...restProps}>
        {(title || description || children) && (
          <div className="file-head">
            {title && <h3 className="tit">{title}</h3>}
            {description && (
              <div>
                <p>{description}</p>
              </div>
            )}
            {children}
          </div>
        )}

        <div
          className={classNames('file-upload', isDragActive && 'active')}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <p className="txt">{uploadText}</p>
          <div className="file-upload-btn-wrap">
            <input
              type="file"
              name="myFile"
              id={fileInputId}
              hidden
              multiple
              accept={acceptedFileTypes?.map(type => `.${type}`).join(',')}
              onChange={handleInputChange}
              disabled={disabled}
              ref={fileInputRef}
            />
            <label htmlFor={fileInputId}>
              <Button
                variant="primary"
                size="medium"
                disabled={disabled}
                onClick={() => {
                  fileInputRef.current?.click()
                }}
              >
                <i className="svg-icon ico-upload"></i>파일선택
              </Button>
            </label>
          </div>
        </div>

        {files.length > 0 && (
          <div className="file-list">
            <div className="total">
              <span className="current">{files.length}개</span> / {maxFiles}개
            </div>
            <ul className="upload-list">
              {files.map(file => (
                <li key={file.id} className={classNames(file.status === 'error' && 'is-error')}>
                  <div className={classNames('file-info', (file.onDownload || file.onPreview) && 'm-column')}>
                    <div className="file-name">
                      {file.name} [{file.type}, {formatFileSize(file.size)}]
                    </div>
                    <div className="btn-wrap">
                      {renderFileStatus(file)}
                      {renderFileActions(file)}
                    </div>
                  </div>
                  {file.status === 'error' && file.errorMessage && <p className="file-hint-invalid">{file.errorMessage}</p>}
                </li>
              ))}
            </ul>
            {files.length > 1 && allowDelete && (
              <div className="upload-delete-btn">
                <Button variant="tertiary" size="xsmall" onClick={handleAllFilesDelete} disabled={disabled}>
                  전체 파일 삭제<i className="svg-icon ico-angle right"></i>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }
)

FileUpload.displayName = 'FileUpload'

export default FileUpload
