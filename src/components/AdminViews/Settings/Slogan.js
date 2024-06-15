/* eslint-disable react/prop-types */
/* eslint no-return-assign: "error" */
import React, { useState, useEffect, useRef } from 'react';
import { useIntl } from 'react-intl';
import useAPI, { get, put } from 'hooks/useAPI';
import { Editor } from '@tinymce/tinymce-react';

export default function ChangeSlogan({ callApi }) {
  const [oldSlogan, setOldSlogan] = useState('');
  const [responseError, setResponseError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [payload, setPayload] = useState(null);
  const [isSloganChanged, setIsSloganChanges] = useState(null);
  const [writeSlogan, setWriteSlogan] = useState(null);
  const maxSloganLength = 500;
  const editorRef = useRef(null);
  const { response: currentSlogan, getting, setRecall: callCurrentSlogan } = useAPI(
    get,
    'ServiceProvider/GetSpSlogan',
  );

  const {
    response: editResponse,
    isLoading: editing,
    setRecall: callEditSlogan,
  } = useAPI(put, 'ServiceProvider/SetSpSlogan', payload);

  const {
    response: deleteRes,
    isLoading: deleting,
    setRecall: callDeleteSlogan,
  } = useAPI(put, 'ServiceProvider/DeleteSpSlogan');

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        setSuccess(false);
        setSubmit(false);
      }, 3000);
    }
  }, [success]);

  /* -------------------------------------------------------------------------- */
  /*                         for update the slogan text                         */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (editResponse?.error) {
      setResponseError(editResponse.error.message);
      setSubmit(false);
    }
    if (editResponse?.data) {
      callCurrentSlogan(true);
      setWriteSlogan(null);
      setSuccess(true);
      setSubmit(false);
    }
  }, [editResponse]);

  /* -------------------------------------------------------------------------- */
  /*                    for delete the slogan which be empty                    */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (deleteRes?.error) {
      setResponseError(editResponse.error.message);
      setSubmit(false);
    }
    if (deleteRes?.data) {
      callCurrentSlogan(true);
      setWriteSlogan(null);
      setSuccess(true);
      setSubmit(false);
    }
  }, [deleteRes]);

  useEffect(() => {
    if (payload) {
      callEditSlogan(true);
    }
  }, [payload]);

  /* -------------------------------------------------------------------------- */
  /*                        get the  current saved slogan                       */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (currentSlogan?.data) {
      setOldSlogan(currentSlogan?.data);
      setWriteSlogan(currentSlogan?.data);
      setIsSloganChanges(false);
    } else {
      setOldSlogan('');
      setWriteSlogan('');
      setIsSloganChanges(false);
    }
  }, [currentSlogan]);

  useEffect(() => {
    if (!writeSlogan) {
      callCurrentSlogan(callApi);
    }
  }, [callApi]);

  const handleChange = (value) => {
    setWriteSlogan(value);
    if (!oldSlogan && value.length !== oldSlogan.length) {
      setIsSloganChanges(true);
    } else if (oldSlogan && value !== oldSlogan) {
      setIsSloganChanges(true);
    } else {
      setIsSloganChanges(false);
    }
  };
  const handleSubmit = () => {
    setSubmit(true);
    if (writeSlogan) {
      setPayload({
        slogan: writeSlogan,
      });
    } else {
      callDeleteSlogan(true);
    }
    setIsSloganChanges(false);
  };

  const { locale, messages } = useIntl();

  return (
    <>
      <h2 className="title mb-2">{messages['admin.settings.SloganEdit']}</h2>
      {success && (
        <div className="alert alert-success font-weight-bold" role="alert">
          {messages['admin.settings.SloganSucess']}
        </div>
      )}
      {responseError && (
        <div className="alert alert-danger font-weight-bold" role="alert">
          {responseError}
        </div>
      )}
      <div>
        <Editor
          apiKey="qzr3pgntzsvoyd7n4p8isumfqo58rce2mlq2dmwqhiddqqan"
          onInit={(evt, editor) => (editorRef.current = editor)}
          onEditorChange={handleChange}
          init={{
            directionality: `${locale === 'ar' && 'rtl'}`,
            language: `${locale === 'ar' && 'ar'}`,
            menubar: false, // remove menubar if not needed
            toolbar:
              'styleselect| bold italic underline | alignleft aligncenter alignright alignjustify ltr rtl', // add custom buttons for your toolbar
            style_formats: [
              { title: 'H1', block: 'h1' },
              { title: 'H2', block: 'h2' },
              { title: 'H3', block: 'h3' },
              { title: 'H4', block: 'h4' },
              { title: 'H5', block: 'h5' },
              { title: 'H6', block: 'h6' },
              { title: 'Paragraph', block: 'p' },
            ], // customize the styleselect dropdown in toolbar with only these
            height: 250, // Editor height
            resize: false, // disallow editor resize
            statusbar: false, // remove bottom status bar
            branding: false, // remove tinymce branding
            plugins: 'noneditable directionality', // add the noneditable plugin
            content_css: 'material-outline',
            skin: 'material-outline', // use the material ui theme
            dir: true,
          }}
          initialValue={oldSlogan}
        />
        {writeSlogan?.length > maxSloganLength && (
          <small className="redColor">{messages['admin.settings.SloganError']}</small>
        )}
      </div>
      <div className="alignBtn">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={
            !isSloganChanged ||
            success ||
            getting ||
            editing ||
            deleting ||
            writeSlogan?.length > maxSloganLength
          }
          className="btn btn-primary"
        >
          {submit && (
            <span
              className="spinner-border spinner-border-sm spinnerMr"
              role="status"
              aria-hidden="true"
            ></span>
          )}{' '}
          {messages['common.save']}
        </button>
      </div>
    </>
  );
}
