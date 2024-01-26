import Modal from "../Modal.tsx";
import check from "./animated-checkmark.module.scss";

type OrderSuccessModalProps = {
  buttonFn?: () => void
}

export default function OrderSuccessModal(props: OrderSuccessModalProps) {
  return (
    <Modal
      buttonText="Okay!"
      buttonFn={props.buttonFn}
    >
      <svg className={check.checkmark} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
        <circle className={check.checkmark__circle} cx="26" cy="26" r="25" fill="none"/>
        <path className={check.checkmark__check} fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
      </svg>
      <h5
        style={{
          fontSize: '1.2rem',
        }}
      >Your order has been placed!</h5>
    </Modal>
  )
}