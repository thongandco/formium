/**
 * Copyright (c) Formium, Inc. and its affiliates.
 *
 * This source code is licensed under the Business Source License found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Form, FormElement, FormElementType } from '@formium/client';
import { canUseDOM } from '@formium/utils';
import {
  Field, FieldConfig, Form as FormikForm,
  FormikConfig,





  FormikContext, FormikValues,

  useField, useFormik,






  useFormikContext
} from 'formik';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Yup from 'yup';
import { unstable_FormiumLogic as FormiumLogic } from './FormiumLogic';
import { useIsomorphicLayoutEffect } from './utils/useIsomorphicLayoutEffect';
import { useStorage } from './utils/useSessionStorage';

function SubmitButton(props: any) {
  return <button type="submit" {...props} />;
}

function Button(props: any) {
  return <button type="button" {...props} />;
}

function Header({
  page: page,
  pageIndex: pageIndex,
}: {
  page: FormElement;
  pageIndex: number;
}) {
  return (
    <>
      {page.title ? (
        pageIndex === 0 ? (
          <h1>{page.title}</h1>
        ) : (
          <h2>{page.title}</h2>
        )
      ) : null}
      {page.description ? <p>{page.description}</p> : null}
    </>
  );
}

type ComponentType =
  | 'a'
  | 'blockquote'
  | 'code'
  | 'delete'
  | 'em'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'hr'
  | 'img'
  | 'inlineCode'
  | 'li'
  | 'ol'
  | 'p'
  | 'pre'
  | 'strong'
  | 'sup'
  | 'table'
  | 'td'
  | 'thematicBreak'
  | 'tr'
  | 'ul'
  | 'b'
  | 'u'
  | 's'
  | 'i'
  | 'label'
  | 'a'
  | 'tbody'
  | 'th'
  | 'thead'
  | 'tr';

export type HtmlComponents = {
  [key in ComponentType]?: React.ComponentType<{ children: React.ReactNode }>;
};

export interface FormiumFormConfig<V> {
  /** Formium Form */
  data: Form;
  /** Initial values */
  initialValues?: V;
  /** Submit callback */
  onSubmit: (values: V) => Promise<void>;
  /**
   * Callback for triggering side effects when pages change
   */
  onChangePage?: (values: V, page: number) => void;
  components?: {
    ShortText: any;
    LongText: any;
    Date: any;
    Email: any;
    Url: any;
    MultipleChoice: any;
    Checkboxes: any;
    SubmitButton: any;
    Button: any;
    Header: any;
    PageWrapper: any;
    ElementsWrapper: any;
    FooterWrapper: any;
    FieldWrapper: any;
    Label: any;
    TextInput: any;
    Description: any;
  };
}

interface TextFieldProps {
  label: string;
  field: {
    id: string;
    name: string;
    required?: boolean;
    description?: string;
    placeholder?: string;
    value: string;
    onChange: (e: React.BaseSyntheticEvent) => void;
    onBlur: (e: React.BaseSyntheticEvent) => void;
    onFocus: (e: React.BaseSyntheticEvent) => void;
  };
}

function TextField<V>({
  required,
  id,
  label,
  ...props
}: FieldConfig & { id: string; label: string; required?: boolean }) {
  const [field, meta] = useField(props);
  return (
    <p>
      <label htmlFor={id} style={{ display: 'block', fontWeight: 500 }}>
        {label} {!required ? <small>(optional)</small> : null}
      </label>
      <input
        {...field}
        type="text"
        placeholder="Type your answer here"
        aria-describedby={`${id}-error`}
      />
      {!!meta.error && !!meta.touched ? (
        <div id={`${id}-error`} data-error="true">
          {meta.error}
        </div>
      ) : null}
    </p>
  );
}

function TextareaField<V>({
  required,
  ...props
}: FieldConfig & { id: string; label: string; required?: boolean }) {
  const [field, meta] = useField(props);
  return (
    <p>
      <label htmlFor={props.id} style={{ display: 'block', fontWeight: 500 }}>
        {props.label} {!required ? <small>(optional)</small> : null}
      </label>
      <textarea
        {...field}
        {...props}
        style={{ display: 'block' }}
        rows={5}
        placeholder="Type your answer here"
        aria-describedby={`${props.id}-error`}
      />
      {!!meta.error && !!meta.touched ? (
        <div id={`${props.id}-error`}>{meta.error}</div>
      ) : null}
    </p>
  );
}

function DateField<V>({
  required,
  ...props
}: FieldConfig & {
  id: string;
  label: string;
  required?: boolean;
  min?: string;
  max?: string;
}) {
  const [field, meta] = useField(props);
  return (
    <p>
      <label htmlFor={props.id}>
        {props.label} {!required ? <small>(optional)</small> : null}
      </label>
      <input
        {...field}
        {...props}
        type="date"
        aria-describedby={`${props.id}-error`}
      />
      {!!meta.error && !!meta.touched ? (
        <div id={`${props.id}-error`} data-error="true">
          {meta.error}
        </div>
      ) : null}
    </p>
  );
}

const RadioGroupField = React.memo<
  FieldConfig & {
    label: string;
    id: string;
    name: string;
    required?: boolean;
    choices: Array<{ id: string; title: string }>;
  }
>(({ label, id, name, choices, required, ...props }) => {
  const [_, meta] = useField({ name });
  return (
    <p>
      <div id={id} style={{ display: 'block', fontWeight: 500 }}>
        {label} {!required ? <small>(optional)</small> : null}
      </div>
      <div>
        {choices &&
          choices.length > 0 &&
          choices.map((c: any) => (
            <div key={c.id}>
              <Field
                aria-describedby={`${id}-error`}
                value={c.title}
                type="radio"
                name={name}
                id={c.id}
              />
              <label htmlFor={c.id} style={{ marginLeft: '.25rem' }}>
                {c.title}
              </label>
            </div>
          ))}
      </div>
      {!!meta.error && !!meta.touched ? (
        <div id={`${id}-error`} data-error="true">
          {meta.error}
        </div>
      ) : null}
    </p>
  );
});

function CheckboxGroupField<V>({
  label,
  id,
  name,
  choices,
  required,
  ...props
}: FieldConfig & {
  label: string;
  id: string;
  required?: boolean;
  name: string;
  choices: Array<{ id: string; title: string }>;
}) {
  const formik = useFormikContext();
  const meta = formik.getFieldMeta(name);
  return (
    <p>
      <div id={id}>
        {label} {!required ? <small>(optional)</small> : null}
      </div>
      <div role="group" aria-labelledby={id}>
        {choices &&
          choices.length > 0 &&
          choices.map((c: any) => (
            <div key={c.id}>
              <Field
                {...props}
                role="checkbox"
                value={c.title}
                type="checkbox"
                name={name}
                id={c.id}
              />
              <label htmlFor={c.id}>{c.title}</label>
            </div>
          ))}
      </div>
      {!!meta.error && !!meta.touched ? (
        <div id={`${id}-error`} data-error="true">
          {meta.error}
        </div>
      ) : null}
    </p>
  );
}

export const defaultComponents = {
  ShortText: TextField,
  LongText: TextareaField,
  Date: DateField,
  Email: TextField,
  Url: TextField,
  MultipleChoice: RadioGroupField,
  Checkboxes: CheckboxGroupField,
  SubmitButton,
  Button,
  Header,
  Label: (props: JSX.IntrinsicElements['label']) => <label {...props} />,
  Description: (props: JSX.IntrinsicElements['div']) => <div {...props} />,
  TextInput: (props: JSX.IntrinsicElements['input']) => <input {...props} />,
  ElementsWrapper: ({ children }: any) => children,
  PageWrapper: ({ children }: any) => children,
  FooterWrapper: ({ children }: any) => children,
  FieldWrapper: (props: any) => <div {...props} />,
  h1: (props: JSX.IntrinsicElements['h1']) => <h1 {...props} />,
  h2: (props: JSX.IntrinsicElements['h2']) => <h2 {...props} />,
  h3: (props: JSX.IntrinsicElements['h3']) => <h3 {...props} />,
  h4: (props: JSX.IntrinsicElements['h4']) => <h4 {...props} />,
  h5: (props: JSX.IntrinsicElements['h5']) => <h5 {...props} />,
  h6: (props: JSX.IntrinsicElements['h6']) => <h6 {...props} />,
  p: (props: JSX.IntrinsicElements['p']) => <p {...props} />,
  b: (props: JSX.IntrinsicElements['b']) => <b {...props} />,
  u: (props: JSX.IntrinsicElements['u']) => <u {...props} />,
  label: (props: JSX.IntrinsicElements['label']) => <label {...props} />,
  input: (props: JSX.IntrinsicElements['input']) => <input {...props} />,
  s: (props: JSX.IntrinsicElements['s']) => <s {...props} />,
  i: (props: JSX.IntrinsicElements['i']) => <i {...props} />,
  em: (props: JSX.IntrinsicElements['em']) => <em {...props} />,
  code: (props: JSX.IntrinsicElements['code']) => <code {...props} />,
  strong: (props: JSX.IntrinsicElements['strong']) => <strong {...props} />,
  pre: (props: JSX.IntrinsicElements['pre']) => <pre {...props} />,
  a: (props: JSX.IntrinsicElements['a']) => <a {...props} />,
  ul: (props: JSX.IntrinsicElements['ul']) => <ul {...props} />,
  ol: (props: JSX.IntrinsicElements['ol']) => <ol {...props} />,
  li: (props: JSX.IntrinsicElements['li']) => <li {...props} />,
  blockquote: (props: JSX.IntrinsicElements['blockquote']) => (
    <blockquote {...props} />
  ),
  img: (props: JSX.IntrinsicElements['img']) => <img {...props} />,
  table: (props: JSX.IntrinsicElements['table']) => <table {...props} />,
  tbody: (props: JSX.IntrinsicElements['tbody']) => <tbody {...props} />,
  td: (props: JSX.IntrinsicElements['td']) => <td {...props} />,
  th: (props: JSX.IntrinsicElements['th']) => <th {...props} />,
  thead: (props: JSX.IntrinsicElements['thead']) => <thead {...props} />,
  tr: (props: JSX.IntrinsicElements['tr']) => <tr {...props} />,
};

const Page: React.FC<any> = ({ children }) => children;

Page.displayName = 'FormiumPage';

export const getElementsFromForm = (form?: Form) => {
  if (!form) {
    return [];
  }
  if (!form.schema?.fields) {
    return [];
  }

  return Object.values(form.schema.fields).filter(
    i =>
      i.type !== FormElementType.GROUP &&
      i.type !== FormElementType.PAGE &&
      i.type !== FormElementType.CHOICE
  );
};

export function getValidationSchema(inputElements?: FormElement[]) {
  return Yup.object(
    inputElements &&
      inputElements.reduce((prev: any, curr: any) => {
        let validation;
        if (curr.hidden) {
          return prev;
        }
        // @todo make this a switch
        if (curr.type === FormElementType.CHECKBOX) {
          validation = Yup.array().of(Yup.string());
        } else if (
          curr.type === FormElementType.RADIO &&
          curr.children &&
          curr.children.length > 0
        ) {
          validation = Yup.string();
          if (!curr.allowOther) {
            validation = validation.oneOf(
              curr.children.map((c: any) => c.title)
            );
          }
        } else if (
          curr.type === FormElementType.SHORT_TEXT ||
          curr.type === FormElementType.LONG_TEXT
        ) {
          validation = Yup.string();
          if (curr.maxLength) {
            validation = validation.max(
              curr.maxLength,
              `Must be less than ${curr.maxLength}`
            );
          }
        } else if (curr.type === FormElementType.EMAIL) {
          validation = Yup.string().email('Invalid email');
          if (curr.maxLength) {
            validation = validation.max(
              curr.maxLength,
              `Must be less than ${curr.maxLength} characters`
            );
          }
        } else if (curr.type === FormElementType.PHONE_NUMBER) {
          validation = Yup.string();
          if (curr.maxLength) {
            validation = validation.max(
              curr.maxLength,
              `Must be less than ${curr.maxLength} characters`
            );
          }
        } else if (curr.type === FormElementType.DATE) {
          validation = Yup.date();
        } else if (curr.type === FormElementType.TIME) {
          validation = Yup.string();
        } else if (curr.type === FormElementType.URL) {
          validation = Yup.string().url('Invalid URL');
          if (curr.maxLength) {
            validation = validation.max(
              curr.maxLength,
              `Must be less than ${curr.maxLength} characters`
            );
          }
        } else if (curr.type === FormElementType.BOOLEAN) {
          validation = Yup.boolean();
        } else if (curr.type === FormElementType.NUMBER) {
          validation = Yup.number();
          if (curr.minValue) {
            validation = validation.min(
              curr.minValue,
              `Must be greater than ${curr.minValue}`
            );
          }
          if (curr.maxValue) {
            validation = validation.max(
              curr.maxValue,
              `Must be less than ${curr.maxValue}`
            );
          }
        }

        if (curr.required) {
          // @todo fix type
          validation = (validation as any).required(
            curr.requiredText ?? 'This question requires an answer.'
          );
        }

        // @todo fix type
        (prev as any)[curr.slug] = validation;
        return prev;
      }, {})
  );
}

type NestedField = FormElement & { children?: FormElement[] };

export function getInitialValues<Values>(inputElements: NestedField[]) {
  return inputElements.reduce((prev: any, curr: NestedField) => {
    if (curr.type === FormElementType.CHECKBOX) {
      (prev as any)[curr.slug] = [];
    } else {
      (prev as any)[curr.slug] = curr.defaultValue ?? '';
    }
    return prev;
  }, {} as Values);
}

function denormalize(arr: string[], get: (id: string) => any): NestedField[] {
  return (
    arr &&
    arr.map(id => {
      const el = get(id);
      return {
        ...el,
        ...(el.items && el.items.length > 0
          ? { children: denormalize(el.items, get) }
          : {}),
      };
    })
  );
}

export function FormiumForm<Values extends FormikValues = FormikValues>({
  data: _data,
  components = defaultComponents,
  ...props
}: Omit<FormikConfig<Values>, 'initialValues'> & FormiumFormConfig<Values>) {
  const [form, setForm] = React.useState<Form>(_data);
  const children = denormalize(
    form?.schema?.pageIds ?? [],
    (id: string) => form?.schema?.fields[id]
  );
  const initialValues = getInitialValues(getElementsFromForm(form));
  const setFieldProperty = React.useCallback(
    (id: string, partial: Partial<FormElement>) => {
      setForm(f => ({
        ...f,
        schema: {
          ...(f.schema ?? {}),
          fields: {
            ...(f.schema?.fields ?? {}),
            [id]: {
              ...(f.schema?.fields[id] ?? {}),
              ...partial,
            } as FormElement,
          },
        },
      }));
    },
    [setForm]
  );

  return (
    <FormiumFormWizard
      components={components}
      initialValues={initialValues}
      data={_data}
      {...props}
    >
      {children &&
        children.map((page: NestedField, pageIndex: number) => (
          <Page
            key={page.id}
            validationSchema={getValidationSchema(
              children![pageIndex].children!
            )}
          >
            <components.Header form={form} page={page} pageIndex={pageIndex} />
            <components.ElementsWrapper>
              {page.children &&
                page.children.map((element: NestedField, index: number) => {
                  const {
                    id,
                    children,
                    actions,
                    items,
                    hidden,
                    required,
                    requiredText,
                    defaultValue,
                    placeholder,
                    ...item
                  } = element;
                  if (hidden) {
                    return null;
                  }
                  return (
                    <components.FieldWrapper key={id}>
                      <FormiumLogic
                        form={form}
                        element={element}
                        setFieldProperty={setFieldProperty}
                      />

                      {item.type === FormElementType.SHORT_TEXT ? (
                        <components.ShortText
                          label={item.title}
                          name={item.slug}
                          placeholder={placeholder}
                          required={required}
                          id={id}
                          {...item}
                        />
                      ) : item.type === FormElementType.EMAIL ? (
                        <components.Email
                          label={item.title}
                          name={item.slug}
                          placeholder={placeholder}
                          required={required}
                          id={id}
                          {...item}
                        />
                      ) : item.type === FormElementType.URL ? (
                        <components.Url
                          label={item.title}
                          name={item.slug}
                          placeholder={placeholder}
                          required={required}
                          id={id}
                          {...item}
                        />
                      ) : item.type === FormElementType.RADIO ? (
                        <components.MultipleChoice
                          choices={children}
                          label={item.title}
                          name={item.slug}
                          id={id}
                          {...item}
                        />
                      ) : item.type === FormElementType.CHECKBOX ? (
                        <>
                          <components.Checkboxes
                            choices={children}
                            label={item.title}
                            name={item.slug}
                            id={id}
                            {...item}
                          />
                        </>
                      ) : item.type === FormElementType.LONG_TEXT ? (
                        <>
                          <components.LongText
                            label={item.title}
                            name={item.slug}
                            placeholder={placeholder}
                            required={required}
                            id={id}
                            {...item}
                          />
                        </>
                      ) : item.type === FormElementType.DATE ? (
                        <>
                          <components.Date
                            label={item.title}
                            name={item.slug}
                            placeholder={placeholder}
                            required={required}
                            id={id}
                            {...item}
                          />
                        </>
                      ) : null}
                    </components.FieldWrapper>
                  );
                })}
            </components.ElementsWrapper>
          </Page>
        ))}
    </FormiumFormWizard>
  );
}
const getFormPageStorageKey = (id: string) => `formium-${id}-form-page`;
const getFormStateStorageKey = (id: string) => `formium-${id}-form-state`;

export function FormiumFormWizard<Values extends FormikValues = FormikValues>({
  initialValues,
  children,
  onSubmit,
  components = defaultComponents,
  debug,
  ...props
}: Omit<FormikConfig<Values>, 'initialValues'> &
  FormiumFormConfig<Values> & {
    debug?: boolean;
  }) {
  const { id } = props.data;
  const pageStorageKey = React.useMemo(() => getFormPageStorageKey(id), [id]);
  const stateStorageKey = React.useMemo(() => getFormStateStorageKey(id), [id]);
  const [page, setPage] = useStorage(pageStorageKey, 0);
  const [values, setValues] = React.useState(initialValues || {});
  const next = React.useCallback(
    newValues => {
      if (children) {
        ReactDOM.unstable_batchedUpdates(() => {
          setPage(p =>
            Math.min(p + 1, React.Children.toArray(children).length - 1)
          );
          setValues(newValues);
        });
      }
    },
    [setPage, setValues, children]
  );
  const previous = React.useCallback(() => {
    setPage(p => Math.max(p - 1, 0));
  }, [setPage]);

  const validationSchema = React.useCallback(
    v => {
      const activePage: any = React.Children.toArray(children)[page];
      return activePage.props.validationSchema
        ? activePage.props.validationSchema
        : {};
    },
    [children, page]
  );

  const handleSubmit = React.useCallback(
    async (currentValues, formikActions) => {
      const isLastPage = page === React.Children.count(children) - 1;

      if (isLastPage) {
        return onSubmit(currentValues).then(() => {
          sessionStorage.removeItem(pageStorageKey);
          sessionStorage.removeItem(stateStorageKey);
        });
      } else {
        formikActions.setTouched({});
        next(currentValues);
        return;
      }
    },
    [onSubmit, children, next, page]
  );
  const activePage = React.Children.toArray(children)[page];
  const isLastPage = page === React.Children.count(children) - 1;
  const formik = useFormik({
    initialValues: values as any,
    onSubmit: handleSubmit,
    // enableReinitialize: true,
    validationSchema,
    ...props,
  });

  const {
    setFormikState,
    values: formikValues,
    touched,
    errors,
    initialValues: formikInitialValues,
  } = formik;

  React.useEffect(() => {
    if (canUseDOM()) {
      sessionStorage.setItem(
        stateStorageKey,
        JSON.stringify({
          values: formikValues,
          touched,
          errors,
          initialValues: formikInitialValues,
        })
      );
    }
  }, [formikValues, touched, errors, formikInitialValues, stateStorageKey]);

  useIsomorphicLayoutEffect(() => {
    try {
      const maybeF = sessionStorage.getItem(stateStorageKey);
      if (maybeF) {
        const newState = JSON.parse(maybeF);
        setFormikState(newState);
      }
    } catch (_error) {}
  }, [setFormikState, stateStorageKey]);

  return (
    <FormikContext.Provider value={formik}>
      <FormikForm>
        <>
          <components.PageWrapper>
            {activePage}
            <components.FooterWrapper>
              {page > 0 && (
                <components.Button type="button" onClick={previous}>
                  Back
                </components.Button>
              )}
              {!isLastPage && (
                <components.SubmitButton
                  type="submit"
                  disabled={formik.isSubmitting}
                >
                  Next
                </components.SubmitButton>
              )}
              {isLastPage && (
                <components.SubmitButton
                  type="submit"
                  disabled={formik.isSubmitting}
                >
                  Submit
                </components.SubmitButton>
              )}
              {debug ? (
                <>
                  <pre style={{ marginTop: 12, fontSize: 11 }}>
                    {JSON.stringify(formik, null, 2)}
                  </pre>
                  <pre style={{ fontSize: 11 }}>
                    {JSON.stringify({ isLastPage }, null, 2)}
                  </pre>
                </>
              ) : null}
            </components.FooterWrapper>
          </components.PageWrapper>
        </>
      </FormikForm>
    </FormikContext.Provider>
  );
}

FormiumFormWizard.displayName = 'FormiumFormWizard';
