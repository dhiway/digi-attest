import { useCredentialSchemaStore } from '@/store/credential'
import { createFileRoute } from '@tanstack/react-router'
import { ShadCNForm } from '@/components/RJSFShadCNForm'
import validator from '@rjsf/validator-ajv8';

export const Route = createFileRoute('/credential/create')({
  component: RouteComponent,
})
const log = (type: any) => console.log.bind(console, type);

function RouteComponent() {
  const { body } = useCredentialSchemaStore()
  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <ShadCNForm
        schema={body}
        validator={validator}
        onSubmit={(data) => console.log('submitted', data)}
        onError={log}
      />
    </div>
  )
}


