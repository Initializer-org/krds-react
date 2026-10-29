import { Modal } from '@krds.ui/react'

export default function ModalDemo() {
  return (
    <Modal>
      <Modal.Trigger>신청 확인</Modal.Trigger>
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>신청 확인</Modal.Title>
        </Modal.Header>
        <Modal.Body>입력한 내용으로 신청할까요?</Modal.Body>
        <Modal.Footer>
          <Modal.Close>닫기</Modal.Close>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  )
}
