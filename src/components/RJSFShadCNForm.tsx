import { withTheme } from '@rjsf/core'
import { type ThemeProps } from '@rjsf/core'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'

// Custom FieldTemplate: adds spacing between label and input, removes duplicate label
const CustomFieldTemplate = ({ id, children, label, rawErrors, required }: any) => (
  <div className="mb-6">
    {label && <Label htmlFor={id} className="mb-2 block">{label}{required ? '*' : ''}</Label>}
    {children}
    {rawErrors?.length > 0 && (
      <ul className="mt-1 space-y-1">
        {rawErrors.map((error: string, idx: number) => (
          <li key={idx} className="text-red-600 text-sm">
            {error}
          </li>
        ))}
      </ul>
    )}
  </div>
)

// Custom ObjectFieldTemplate: remove duplicate "label" for fieldset titles
const CustomObjectFieldTemplate = ({ description, properties }: any) => (
  <fieldset className="border p-4 rounded-md mb-6">
    {/* {title && <h2 className="text-2xl font-semibold mb-2">{title}</h2>} */}
    {description && <p className="text-muted-foreground mb-4">{description}</p>}
    {properties.map((prop: any) => prop.content)}
  </fieldset>
)

const ShadCNTheme: ThemeProps = {
  widgets: {
    TextWidget: (props) => (
      <Input
        id={props.id}
        value={props.value || ''}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.rawDescription || props.placeholder || props.name || ''}
        type={props.options.inputType || 'text'}
      />
    ),
    SelectWidget: (props) => (
      <Select
        onValueChange={props.onChange}
        value={props.value || ''}
      >
        <SelectTrigger>
          <SelectValue placeholder={props.rawDescription || props.placeholder || props.name ? `Select ${props.name}` : 'Select option'} />
        </SelectTrigger>
        <SelectContent>
          {props.options.enumOptions?.map((opt) => (
            <SelectItem key={opt.value} value={opt.value as string}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ),
    TextareaWidget: (props) => (
      <Textarea
        id={props.id}
        value={props.value || ''}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.rawDescription || props.placeholder || ''}
      />
    ),
    CheckboxWidget: (props) => (
      <div className="flex items-center gap-2 mb-2">
        <Switch
          checked={!!props.value}
          onCheckedChange={(v) => props.onChange(v)}
          id={props.id}
        />
        <Label htmlFor={props.id}>{props.label}</Label>
      </div>
    ),
  },
  templates: {
    FieldTemplate: CustomFieldTemplate,
    ObjectFieldTemplate: CustomObjectFieldTemplate,
    ErrorListTemplate: () => { return <></> },
    ButtonTemplates: {
      SubmitButton: (props) => (
        <Button type="submit" className="mt-6">{props.uiSchema?.['ui:submitButtonText'] || 'Submit'}</Button>
      ),
    },
  },
}

export const ShadCNForm = withTheme(ShadCNTheme)
