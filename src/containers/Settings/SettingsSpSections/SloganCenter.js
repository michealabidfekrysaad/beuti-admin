/* eslint-disable react/prop-types */
/* eslint no-return-assign: "error" */
import React, { useState, useRef, useEffect } from 'react';
import { Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import useAPI, { get, put } from 'hooks/useAPI';
import { Editor } from '@tinymce/tinymce-react';

export default function SloganCenter() {
  const { messages, locale } = useIntl();
  const [oldSlogan, setOldSlogan] = useState('');
  const [submit, setSubmit] = useState(false);
  const [success, setSuccess] = useState(false);
  const [payload, setPayload] = useState(null);
  //   const [writeSlogan, setWriteSlogan] = useState(null);
  const [selectedImage, setSelectedImage] = useState();
  const [imgBase64, setImgBase64] = useState();
  const [photoError, setPhotoError] = useState(false);
  const editorRef = useRef(null);
  const maxSloganLength = 500;

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
    if (payload) {
      callEditSlogan(true);
    }
  }, [payload]);

  useEffect(() => {
    callCurrentSlogan(true);
  }, []);

  useEffect(() => {
    if (currentSlogan?.data) {
      setOldSlogan(currentSlogan?.data);
    } else {
      setOldSlogan('');
    }
  }, [currentSlogan]);

  useEffect(() => {
    if (editResponse?.error) {
      setSubmit(false);
    }
    if (editResponse?.data) {
      callCurrentSlogan(true);
      setSuccess(true);
      setSubmit(false);
    }
  }, [editResponse]);

  useEffect(() => {
    if (deleteRes?.error) {
      setSubmit(false);
    }
    if (deleteRes?.data) {
      callCurrentSlogan(true);
      setSuccess(true);
      setSubmit(false);
    }
  }, [deleteRes]);

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        setSuccess(false);
        setSubmit(false);
      }, 3000);
    }
  }, [success]);

  const handleChange = (value) => {
    setOldSlogan(value);
  };
  const imageChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const base64 = await convertBase64(e.target.files[0]);
      setImgBase64(base64);
      setSelectedImage(e.target.files[0]);
      setPhotoError(false);
    } else {
      setPhotoError(true);
    }
  };
  const convertBase64 = (file) =>
    new Promise((resolve) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
    });

  return (
    <>
      <Col
        lg={4}
        xs={12}
        className="add-product__image-section"
        style={{ height: '350px' }}
      >
        <p className="add-product__image-section--header">
          {messages['admin.settings.slogan']}
        </p>
        <div className="mt-2 add-product__image-section--choose-image">
          {!selectedImage && (
            <div className="add-product__image-section--choose-image__icon">
              <div className="add-product__image-section--camera-photo">
                <i className="flaticon-photo-camera"></i>
              </div>
              <input accept="image/png, image/jpeg" type="file" onChange={imageChange} />
            </div>
          )}

          {selectedImage && (
            <div className="image-display">
              <img
                className="displayed-image"
                src={URL.createObjectURL(selectedImage)}
                alt="Thumb"
              />
              <button
                className="btn-delete"
                type="button"
                title={messages['common.delete']}
                onClick={() => {
                  setSelectedImage();
                  setImgBase64();
                }}
              >
                <i className="flaticon-close"></i>
              </button>
            </div>
          )}
        </div>
        {photoError && (
          <p className="pt-2 text-center text-danger">
            {messages['product.add.unsupportedFile']}
          </p>
        )}
      </Col>
      <Col xs={12}>
        <p className="container-box__controllers--header">
          {messages['admin.settings.slogan.phrase']}
        </p>
      </Col>
      <Col xs={10}>
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
          {oldSlogan?.length > maxSloganLength && (
            <small className="redColor">{messages['admin.settings.SloganError']}</small>
          )}
        </div>
      </Col>
    </>
  );
}
