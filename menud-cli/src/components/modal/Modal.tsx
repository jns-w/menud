import styles from './modal.module.scss';
import {ReactNode} from "react";

type ModalProps = {
  children: ReactNode
  buttonText?: string
  buttonFn?: () => void
}

export default function Modal(props: ModalProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          {props.children}
        </div>
        <div
          className={styles.acknowledgeButton}
          onClick={props.buttonFn}
        >
          <h5>{props.buttonText || "Okay"}</h5>
        </div>
      </div>
    </div>
  )
}