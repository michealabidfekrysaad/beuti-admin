/* eslint-disable react/prop-types */

import React from 'react';
import UploadImage from 'components/shared/UploadImage';
import { Modal, Image, Button } from 'react-bootstrap';
import {
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  TextField,
  FormHelperText,
  CircularProgress,
} from '@material-ui/core';

import { useIntl, FormattedMessage } from 'react-intl';

const SendAnnounces = ({
  handleChange,
  setText,
  sentTo,
  open,
  setImageSrc,
  imageSrc,
  setOpen,
  sending,
  text,
  send,
  setTitle,
  title,
}) => {
  const { locale, messages } = useIntl();

  return (
    <>
      <Modal
        show={open}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="bootstrap-modal-customizing"
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter" className="title">
            {locale === 'ar' ? 'إرسال إعلان' : 'Send announcment'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <FormControl component="fieldset" className="mb-3" fullWidth>
              <RadioGroup aria-label="gender" value={sentTo} onChange={handleChange}>
                <FormControlLabel
                  value="1"
                  control={<Radio />}
                  label={`${locale === 'ar' ? 'العملاء' : 'Customers'}`}
                />
                <FormControlLabel
                  value="2"
                  control={<Radio />}
                  label={`${locale === 'ar' ? 'مقدمي الخدمات' : 'Service Provider'}`}
                />
                <FormControlLabel
                  value="3"
                  control={<Radio />}
                  label={`${locale === 'ar' ? 'كلاهما' : 'Both'}`}
                />
              </RadioGroup>
            </FormControl>
            <FormControl fullWidth className="mb-2">
              <TextField
                id="standard-basic"
                label={messages['common.title']}
                value={title}
                onChange={(e) =>
                  e.target.value === ' ' ? null : setTitle(e.target.value)
                }
                error={title.length >= 55}
                variant="filled"
              />
              {title.length >= 55 && (
                <FormHelperText id="component-error-text" error>
                  {messages['common.maxLength']}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl component="fieldset" className="mb-3" fullWidth>
              <TextField
                id="standard-multiline-static"
                label={`${locale === 'ar' ? 'رسالتك' : 'Your message'}`}
                multiline
                rows={6}
                variant="filled"
                value={text}
                onChange={(e) =>
                  e.target.value === ' ' ? null : setText(e.target.value)
                }
              />
              {text.length >= 150 && (
                <FormHelperText error>{messages['common.maxLength']}</FormHelperText>
              )}
              <UploadImage
                className="btn btn-primary mt-3"
                text={messages['admin.settings.SPImages.upload']}
                changeImgText={messages['admin.settings.SPImages.changeUpload']}
                changing
                onDone={setImageSrc}
                acceptedexe="image/x-png,image/jpeg,image/jpg"
                disabled={sending}
              />
            </FormControl>
            <Image
              src={imageSrc}
              style={{ maxHeight: '90px' }}
              className="d-block mt-3"
              rounded
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-danger"
            className="px-4"
            onClick={() => {
              setImageSrc('');
              setText('');
              setTitle('');
              setOpen(false);
            }}
          >
            {/* { */}
            <FormattedMessage id="common.close" />
            {/* } */}
          </Button>
          <Button
            className="px-4"
            disabled={
              text.length < 1 ||
              sending ||
              text.length > 150 ||
              title.length >= 55 ||
              title.length < 1
            }
            onClick={() => send(true)}
          >
            {sending ? (
              <CircularProgress size={24} style={{ color: '#fff' }} />
            ) : (
              messages['send.send.btn']
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SendAnnounces;
