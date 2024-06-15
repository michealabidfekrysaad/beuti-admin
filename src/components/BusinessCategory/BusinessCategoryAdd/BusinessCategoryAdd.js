/* eslint-disable no-unneeded-ternary */
import React, { useState, useEffect } from 'react';
import { Card, Button, Image, Row, Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { Routes } from 'constants/Routes';
import { Link, useHistory } from 'react-router-dom';
import { CircularProgress, FormControl, FormHelperText } from '@material-ui/core';
import { toast } from 'react-toastify';
import UploadImage from 'components/shared/UploadImage';
import useAPI, { post } from 'hooks/useAPI';
import BeutiInput from 'Shared/inputs/BeutiInput';

const BusinessCategoryAdd = () => {
  const history = useHistory();
  const { messages } = useIntl();
  const [activeImageSrc, setActiveImageSrc] = useState('');
  const minChar = 3;
  const maxName = 30;
  const maxDescr = 250;
  const [errorUploadImg, setErrorUploadImg] = useState(false);
  const [formData, setFormData] = useState({
    nameAR: '',
    nameEN: '',
    descriptionAR: '',
    descriptionEN: '',
    image: '',
  });
  const [requestPayload, setRequestPayload] = useState('');

  /* -------------------------------------------------------------------------- */
  /*                            Prepare API FOR CALLS                           */
  /* -------------------------------------------------------------------------- */

  const {
    response: addBusinessCategory,
    isLoading: adding,
    setRecall: recallBusinessCategory,
  } = useAPI(post, 'BusinessCategory/AddBusinessCategory', requestPayload);

  /* -------------------------------------------------------------------------- */
  /*                           Handle When User Submit                          */
  /* -------------------------------------------------------------------------- */

  function handleSubmit(e) {
    e.preventDefault();
    const modifyPayload = {
      ...formData,
      image: activeImageSrc.substring(activeImageSrc.indexOf(',') + 1),
    };
    setRequestPayload(modifyPayload);
  }

  useEffect(() => {
    if (requestPayload) recallBusinessCategory(true);
  }, [requestPayload]);

  /* -------------------------------------------------------------------------- */
  /*                          Handle Error And Success                          */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    if (addBusinessCategory?.error) {
      notify(addBusinessCategory?.error?.message, 'err');
    }
    if (addBusinessCategory?.data?.success) {
      notify(messages[`common.success`]);
      setTimeout(() => {
        history.goBack();
      }, 3000);
    }
  }, [addBusinessCategory]);

  const notify = (message, err) => {
    if (err) {
      toast.error(message);
    } else {
      toast.success(message);
    }
  };

  // UI
  return (
    <Card className="mb-5">
      <Card.Header>
        <div className="title">{messages['sadmin.business.addNewBusinessCategory']}</div>
        <Link to={Routes.businessCategory}>
          <Button variant="outline-danger" className="px-4" disabled={adding}>
            {adding ? (
              <CircularProgress size={24} color="secondary" />
            ) : (
              messages['common.back']
            )}
          </Button>
        </Link>
      </Card.Header>
      <Card.Body>
        <form noValidate autoComplete="off" onSubmit={handleSubmit}>
          {/* // Name Ar */}
          <Row>
            <Col md={6} xs={12} className="mb-2">
              <BeutiInput
                label={messages['sadmin.business.category.ar']}
                //   placeholder={messages['sadmin.business.category.ar']}
                value={formData?.nameAR}
                error={
                  formData.nameAR &&
                  formData.nameAR.length < minChar &&
                  messages['sadmin.business.category.ar.err']
                }
                error2={
                  formData.nameAR &&
                  formData.nameAR.length > maxName &&
                  messages['sadmin.business.category.ar.err.max']
                }
                onChange={(e) => setFormData({ ...formData, nameAR: e.target.value })}
              />
            </Col>

            {/* // Name En */}
            <Col md={6} xs={12} className="mb-2">
              <BeutiInput
                label={messages['sadmin.business.category.en']}
                value={formData?.nameEN}
                error={
                  formData?.nameEN &&
                  formData?.nameEN?.length < minChar &&
                  messages['sadmin.business.category.ar.err']
                }
                error2={
                  formData?.nameEN &&
                  formData?.nameEN?.length > maxName &&
                  messages['sadmin.business.category.ar.err.max']
                }
                onChange={(e) => setFormData({ ...formData, nameEN: e.target.value })}
              />
            </Col>
          </Row>

          <Row>
            <Col xs={12} className="mb-2">
              {/* description ar */}
              <BeutiInput
                label={messages['sadmin.business.category.desc.ar']}
                value={formData?.descriptionAR}
                error={
                  formData?.descriptionAR &&
                  formData?.descriptionAR?.length < minChar &&
                  messages['sadmin.business.category.desc.ar.err']
                }
                error2={
                  formData?.descriptionAR &&
                  formData?.descriptionAR?.length > maxDescr &&
                  messages['sadmin.business.category.desc.ar.err.max']
                }
                onChange={(e) =>
                  setFormData({ ...formData, descriptionAR: e.target.value })
                }
              />
            </Col>
            <Col xs={12} className="mb-2">
              {/* description en */}
              <BeutiInput
                label={messages['sadmin.business.category.desc.en']}
                value={formData?.descriptionEN}
                error={
                  formData?.descriptionEN &&
                  formData?.descriptionEN?.length < minChar &&
                  messages['sadmin.business.category.desc.ar.err']
                }
                error2={
                  formData?.descriptionEN &&
                  formData?.descriptionEN?.length > maxDescr &&
                  messages['sadmin.business.category.desc.ar.err.max']
                }
                onChange={(e) =>
                  setFormData({ ...formData, descriptionEN: e.target.value })
                }
              />
            </Col>
          </Row>

          {/* // Images Upload  */}
          <Row className="row" component="fieldset">
            {adding ? (
              <CircularProgress size={24} color="secondary" className="mt-3" />
            ) : (
              <>
                <Col xs="auto">
                  <UploadImage
                    className="btn btn-primary my-3 d-block"
                    text={messages['sadmin.business.category.image']}
                    changeImgText={messages['sadmin.business.category.image.change']}
                    changing
                    maxSizeUpload="500"
                    acceptedexe="image/png,image/jpeg,image/jpg"
                    onDone={setActiveImageSrc}
                    setErrorMessage={setErrorUploadImg}
                  />
                  <Image src={activeImageSrc} style={{ maxHeight: '100px' }} rounded />
                </Col>
                <Col xs={12}>
                  <FormHelperText id="component-error-text" error>
                    {errorUploadImg}
                  </FormHelperText>
                </Col>
              </>
            )}
          </Row>

          {/* // Submit  */}
          <Col xs="auto" className="text-center mt-3">
            <button
              type="submit"
              className="btn btn-primary w-50"
              disabled={
                adding ||
                !activeImageSrc ||
                formData.nameAR.length < minChar ||
                formData.nameEN.length < minChar ||
                formData.descriptionAR.length < minChar ||
                formData.descriptionEN.length < minChar ||
                formData.nameAR.length > maxName ||
                formData.nameEN.length > maxName ||
                formData.descriptionAR.length > maxDescr ||
                formData.descriptionEN.length > maxDescr
              }
            >
              {adding ? (
                <CircularProgress size={24} style={{ color: '#fff' }} />
              ) : (
                messages['common.save']
              )}
            </button>
          </Col>
        </form>
      </Card.Body>
    </Card>
  );
};

export default BusinessCategoryAdd;
