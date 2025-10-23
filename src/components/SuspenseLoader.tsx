import { Badge } from "./ui/badge";
import { Spinner } from "./ui/spinner";

const SuspenseLoader = (props: { message: string }) => {

  return <div className='flex justify-center items-center main-container'>
    <Badge className="px-4 py-2">
      <Spinner />
      {props.message}
    </Badge>
  </div>

}

export default SuspenseLoader
