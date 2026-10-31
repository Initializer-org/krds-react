import { useState, type FormEvent } from 'react'
import { Button, Checkbox, DateInput, Modal, Radio, RadioGroup, Select, Textarea, TextInput, ToggleSwitch } from '@krds.ui/react'

const initial = { name: '', type: '', content: '', receive: 'online', agree: false, notify: true }
export default function ApplicationForm() {
  const [form, setForm] = useState(initial)
  const [submitted, setSubmitted] = useState(false)
  const [open, setOpen] = useState(false)
  const [resetKey, setResetKey] = useState(0)
  const errors = {
    name: submitted && !form.name.trim() ? '이름을 입력해 주세요.' : '',
    type: submitted && !form.type ? '신청 유형을 선택해 주세요.' : '',
    agree: submitted && !form.agree ? '개인정보 수집·이용에 동의해 주세요.' : ''
  }
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
    const missing = !form.name.trim() ? 'pg-name' : !form.type ? 'pg-type' : !form.agree ? 'pg-agree' : ''
    if (missing) event.currentTarget.querySelector<HTMLElement>(`#${missing}`)?.focus()
    else setOpen(true)
  }
  const reset = () => {
    setForm(initial)
    setSubmitted(false)
    setResetKey(key => key + 1)
  }
  return (
    <div className="pg-section">
      <h3>민원 신청서</h3>
      <p className="pg-hint">필수 항목을 비운 채 신청하면 오류 상태를 볼 수 있습니다.</p>
      <form className="pg-stack" noValidate onSubmit={submit} onReset={reset}>
        <TextInput
          id="pg-name"
          label="이름 (필수)"
          required
          placeholder="홍길동"
          value={form.name}
          onChange={name => setForm({ ...form, name })}
          error={errors.name}
        />
        <Select
          id="pg-type"
          label="신청 유형 (필수)"
          required
          value={form.type}
          onChange={type => setForm({ ...form, type })}
          error={errors.type}
          options={[
            { value: '', label: '선택' },
            { value: 'certificate', label: '증명서 발급' },
            { value: 'report', label: '신고' },
            { value: 'proposal', label: '제안·건의' }
          ]}
        />
        <DateInput key={resetKey} label="희망 처리일" />
        <Textarea
          label="신청 내용"
          placeholder="예시 내용을 입력하세요"
          value={form.content}
          onChange={content => setForm({ ...form, content })}
          maxLength={500}
          showCount
          countTotal={500}
        />
        <fieldset>
          <legend className="pg-legend">수령 방법</legend>
          <RadioGroup name="pg-receive" value={form.receive} onChange={receive => setForm({ ...form, receive })}>
            <Radio value="online">온라인</Radio>
            <Radio value="visit">방문</Radio>
          </RadioGroup>
        </fieldset>
        <ToggleSwitch label="처리 결과 알림 받기" checked={form.notify} onChange={notify => setForm({ ...form, notify })} />
        <div>
          <Checkbox
            id="pg-agree"
            required
            label="개인정보 수집·이용 동의 (필수)"
            checked={form.agree}
            onChange={event => setForm({ ...form, agree: event.target.checked })}
            aria-invalid={!!errors.agree}
            aria-describedby={errors.agree ? 'pg-agree-error' : undefined}
          />
          {errors.agree && (
            <p id="pg-agree-error" className="pg-error">
              {errors.agree}
            </p>
          )}
        </div>
        <div className="pg-row">
          <Button type="reset" variant="tertiary">
            초기화
          </Button>
          <Button type="submit">예시 신청하기</Button>
        </div>
      </form>
      <Modal usePortal open={open} onOpenChange={setOpen}>
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>예시 신청 완료</Modal.Title>
          </Modal.Header>
          <Modal.Body>{form.name}님의 입력을 확인했습니다. 체험용 화면이므로 실제 신청이나 정보 전송은 이루어지지 않았습니다.</Modal.Body>
          <Modal.Footer>
            <Modal.Close asChild>
              <Button type="button">닫기</Button>
            </Modal.Close>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </div>
  )
}
