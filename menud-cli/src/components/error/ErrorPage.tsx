type ErrorProps = {
  message?: string
}
export default function ErrorPage(props: ErrorProps) {
  return (
    <div className="error-page-wrapper">
      <h3>Oops!</h3>
      {props.message ? <h4>{props.message}</h4> : <h4>Something went wrong</h4>}
    </div>
  )
}