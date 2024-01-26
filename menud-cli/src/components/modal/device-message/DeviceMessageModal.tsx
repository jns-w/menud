import Modal from "../Modal.tsx";

type DeviceMessageModalProps = {
  buttonFn?: () => void
}

export default function DeviceMessageModal(props: DeviceMessageModalProps) {
  return (
    <Modal
      buttonText="Okay"
      buttonFn={props.buttonFn}
    >
      <h5
        style={{
          textAlign: 'center',
          margin: '0 20px',
          fontSize: '1.2rem',
        }}
      >
        This demo is designed to be used on a mobile browser, open this on your phone or enable mobile dev view in your
        browser for the intended experience!
      </h5>
    </Modal>
  )
}