import { useState, type FormEvent } from 'react'
import {
  Breadcrumb,
  Button,
  Checkbox,
  DateInput,
  Identifier,
  Masthead,
  Modal,
  Radio,
  RadioGroup,
  Select,
  StepIndicator,
  TextInput
} from '@krds.ui/react'
import './App.css'

const purposes = [
  { value: '', label: '선택' },
  { value: 'bank', label: '금융기관 제출용' },
  { value: 'office', label: '관공서 제출용' },
  { value: 'etc', label: '기타' }
]

/** 민원 신청 화면: 공식 배너·브레드크럼·단계 표시기·입력·셀렉트·날짜 입력·라디오·체크박스·모달 */
export default function App() {
  const [name, setName] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const submit = (event: FormEvent) => {
    event.preventDefault()
    setConfirmOpen(true)
  }

  return (
    <>
      <Masthead text="이 누리집은 대한민국 공식 전자정부 누리집입니다." />
      <main className="page">
        <Breadcrumb
          items={[
            { text: '홈', href: '#' },
            { text: '민원 신청', href: '#apply' }
          ]}
        />
        <h1>주민등록표 등본 발급 신청</h1>
        <StepIndicator
          currentStep={0}
          steps={[
            { step: '1단계', title: '신청 정보 입력' },
            { step: '2단계', title: '본인 인증' },
            { step: '3단계', title: '신청 완료' }
          ]}
        />

        <form className="form" onSubmit={submit}>
          <TextInput label="신청인 이름" placeholder="홍길동" value={name} onChange={setName} required />
          <Select id="purpose" label="발급 용도" options={purposes} />
          <DateInput label="희망 수령일" />
          <RadioGroup name="auth" defaultValue="phone" column>
            <Radio value="phone" description="본인 명의 휴대폰으로 인증합니다.">
              휴대폰 인증
            </Radio>
            <Radio value="certificate" description="금융·공공기관 인증서로 인증합니다.">
              공동인증서
            </Radio>
          </RadioGroup>
          <Checkbox
            id="agree-privacy"
            label="[필수] 개인정보 수집·이용 동의"
            checked={agreed}
            onChange={event => setAgreed(event.target.checked)}
          />
          <Button type="submit" variant="primary" size="large" disabled={!agreed}>
            신청하기
          </Button>
        </form>
      </main>
      <Identifier text="이 누리집은 KRDS React 예제입니다." />

      <Modal open={confirmOpen} onOpenChange={setConfirmOpen}>
        <Modal.Content aria-labelledby="confirm-title">
          <Modal.Header>
            <Modal.Title id="confirm-title">신청 확인</Modal.Title>
          </Modal.Header>
          <Modal.Body>{name || '신청인'}님 이름으로 주민등록표 등본 발급을 신청할까요?</Modal.Body>
          <Modal.Footer>
            <Modal.Close>닫기</Modal.Close>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>
  )
}
