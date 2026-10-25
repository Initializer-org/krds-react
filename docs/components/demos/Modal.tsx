import { Modal } from '@krds.ui/react'

export default function ModalDemo() {
  return (
    <Modal>
      <Modal.Trigger>신청 확인</Modal.Trigger>
      {/* 대화상자 이름은 aria-labelledby로 제목과 직접 연결한다 (README 알려진 문제) */}
      <Modal.Content aria-labelledby="apply-confirm-title">
        <Modal.Header>
          <Modal.Title id="apply-confirm-title">신청 확인</Modal.Title>
        </Modal.Header>
        <Modal.Body>입력한 내용으로 신청할까요?</Modal.Body>
        <Modal.Footer>
          <Modal.Close>닫기</Modal.Close>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  )
}
