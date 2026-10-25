import { useState } from 'react'
import {
  Badge,
  Button,
  Checkbox,
  CheckboxGroup,
  DateInput,
  FileUpload,
  Radio,
  RadioGroup,
  Select,
  StepIndicator,
  Tag,
  TextInput,
  ToggleSwitch
} from '@krds.ui/react'

/** 홈 "컴포넌트 미리보기": 공공 서비스 화면을 KRDS React 컴포넌트로 조합한 예시 (KRDS Vue 문서와 같은 화면) */

const purposes = [
  { value: '', label: '선택' },
  { value: 'bank', label: '금융기관 제출용' },
  { value: 'office', label: '관공서 제출용' },
  { value: 'etc', label: '기타' }
]
const popularKeywords = ['주민등록등본', '건강보험', '여권 발급', '전입신고']
const requests = [
  { title: '주민등록표 등본 발급', date: '2026.10.02', status: '완료', color: 'success' },
  { title: '전입신고', date: '2026.10.05', status: '처리 중', color: 'information' },
  { title: '여권 재발급', date: '2026.10.07', status: '접수', color: 'gray' }
] as const

export default function ShowcaseDemo() {
  const [terms, setTerms] = useState({ privacy: false, identifier: false, notice: false })
  const allAgreed = Object.values(terms).every(Boolean)
  const [keyword, setKeyword] = useState('')

  return (
    <div className="showcase vp-raw">
      <div className="showcase-column">
        <section className="showcase-card" aria-labelledby="showcase-apply">
          <h3 id="showcase-apply">주민등록표 등본 발급</h3>
          <p className="showcase-desc">신청 정보를 입력해 주세요.</p>
          <div className="showcase-form">
            <TextInput label="신청인 이름" placeholder="홍길동" />
            <Select id="showcase-purpose" label="발급 용도" options={purposes} />
            <DateInput label="희망 수령일" />
            <Button variant="primary" size="large">
              신청하기
            </Button>
          </div>
          <p className="showcase-links">
            <a href="/components/input">텍스트 입력 필드</a> · <a href="/components/select">셀렉트</a> ·{' '}
            <a href="/components/date-input">날짜 입력 필드</a> · <a href="/components/button">버튼</a>
          </p>
        </section>

        <section className="showcase-card" aria-labelledby="showcase-terms">
          <h3 id="showcase-terms">약관 동의</h3>
          <p className="showcase-desc">서비스 이용을 위해 약관에 동의해 주세요.</p>
          <CheckboxGroup column>
            <Checkbox
              id="showcase-all"
              label="전체 동의"
              checked={allAgreed}
              onChange={event =>
                setTerms({ privacy: event.target.checked, identifier: event.target.checked, notice: event.target.checked })
              }
            />
            <Checkbox
              id="showcase-privacy"
              label="[필수] 개인정보 수집·이용 동의"
              checked={terms.privacy}
              onChange={event => setTerms({ ...terms, privacy: event.target.checked })}
            />
            <Checkbox
              id="showcase-identifier"
              label="[필수] 고유식별정보 처리 동의"
              checked={terms.identifier}
              onChange={event => setTerms({ ...terms, identifier: event.target.checked })}
            />
            <Checkbox
              id="showcase-notice"
              label="[선택] 처리 결과 알림 수신 동의"
              description="신청 처리 결과를 문자로 안내합니다."
              checked={terms.notice}
              onChange={event => setTerms({ ...terms, notice: event.target.checked })}
            />
          </CheckboxGroup>
          <p className="showcase-links">
            <a href="/components/checkbox">체크박스</a>
          </p>
        </section>

        <section className="showcase-card" aria-labelledby="showcase-search">
          <h3 id="showcase-search">통합 검색</h3>
          <TextInput aria-label="검색어" placeholder="찾으시는 서비스를 입력하세요" value={keyword} onChange={setKeyword} />
          <p className="showcase-subtitle">많이 찾는 서비스</p>
          {/* TagWrap이 패키지 최상위에서 export되지 않아 같은 마크업(krds-tag-wrap)을 직접 쓴다 */}
          <div className="krds-tag-wrap small">
            {popularKeywords.map(item => (
              <Tag
                key={item}
                variant="link"
                href="#"
                onClick={event => {
                  event.preventDefault()
                  setKeyword(item)
                }}
              >
                {item}
              </Tag>
            ))}
          </div>
          <p className="showcase-links">
            <a href="/components/input">텍스트 입력 필드</a> · <a href="/components/tag">태그</a>
          </p>
        </section>
      </div>

      <div className="showcase-column">
        <section className="showcase-card" aria-labelledby="showcase-progress">
          <div className="showcase-title-row">
            <h3 id="showcase-progress">신청 진행 상황</h3>
            <Badge variant="light" color="information" size="small">
              처리 중
            </Badge>
          </div>
          <p className="showcase-desc">전입신고 · 접수번호 2026-1005-0142</p>
          <StepIndicator
            currentStep={1}
            steps={[
              { step: '1단계', title: '신청' },
              { step: '2단계', title: '서류 검토' },
              { step: '3단계', title: '처리' },
              { step: '4단계', title: '완료' }
            ]}
          />
          <p className="showcase-links">
            <a href="/components/step-indicator">단계 표시기</a> · <a href="/components/badge">배지</a>
          </p>
        </section>

        <section className="showcase-card" aria-labelledby="showcase-files">
          <h3 id="showcase-files">증빙 서류 첨부</h3>
          <FileUpload
            title="가족관계증명서"
            description="PDF, JPG, PNG · 10MB 이하"
            acceptedFileTypes={['.pdf', '.jpg', '.png']}
            maxFileSize={10 * 1024 * 1024}
          />
          <p className="showcase-links">
            <a href="/components/file-upload">파일 업로드</a>
          </p>
        </section>
      </div>

      <div className="showcase-column">
        <section className="showcase-card" aria-labelledby="showcase-auth">
          <h3 id="showcase-auth">본인 인증</h3>
          <p className="showcase-desc">본인 확인 방법을 선택해 주세요.</p>
          <RadioGroup name="showcase-auth" defaultValue="phone" column>
            <Radio value="phone" description="본인 명의 휴대폰으로 인증합니다.">
              휴대폰 인증
            </Radio>
            <Radio value="certificate" description="금융·공공기관 인증서로 인증합니다.">
              공동인증서
            </Radio>
            <Radio value="simple" description="민간 인증서 앱으로 인증합니다.">
              간편인증
            </Radio>
          </RadioGroup>
          <div className="showcase-actions">
            <Button variant="secondary" size="medium">
              취소
            </Button>
            <Button variant="primary" size="medium">
              다음
            </Button>
          </div>
          <p className="showcase-links">
            <a href="/components/radio">라디오 버튼</a> · <a href="/components/button">버튼</a>
          </p>
        </section>

        <section className="showcase-card" aria-labelledby="showcase-notify">
          <h3 id="showcase-notify">알림 설정</h3>
          <p className="showcase-desc">처리 결과를 받을 방법을 선택하세요.</p>
          <div className="showcase-toggles">
            <ToggleSwitch label="문자 알림" defaultChecked />
            <ToggleSwitch label="이메일 알림" />
            <ToggleSwitch label="야간(21시~08시) 알림" />
          </div>
          <p className="showcase-links">
            <a href="/components/toggle-switch">토글 스위치</a>
          </p>
        </section>

        <section className="showcase-card" aria-labelledby="showcase-requests">
          <h3 id="showcase-requests">나의 민원 처리 현황</h3>
          <ul className="showcase-requests">
            {requests.map(request => (
              <li key={request.title}>
                <div>
                  <strong>{request.title}</strong>
                  <span>{request.date} 신청</span>
                </div>
                <Badge variant="light" color={request.color} size="small">
                  {request.status}
                </Badge>
              </li>
            ))}
          </ul>
          <p className="showcase-links">
            <a href="/components/badge">배지</a>
          </p>
        </section>
      </div>
    </div>
  )
}
