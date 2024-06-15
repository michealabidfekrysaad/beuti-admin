/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { Icon } from 'semantic-ui-react';
import DeleteImageModal from 'components/shared/DeleteImageModal';
import useAPI, { get, post, deleting } from 'hooks/useAPI';
import UploadImage from 'components/shared/UploadImage';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '85%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function SPImages({ callApi }) {
  const classes = useStyles();
  const [responseError, setResponseError] = useState('');
  const [successDeleted, setSuccessDeleted] = useState(false);
  const [successUploaded, setSuccessUploaded] = useState(false);
  const [payloadDelete, setPayloadDelete] = useState(null);
  const [payloadUpload, setPayloadUpload] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const { messages } = useIntl();

  // Getting All Images API
  const {
    response: currentImages,
    isLoading: getting,
    setRecall: callCurrentImages,
  } = useAPI(get, 'Image/SPImages');

  // Upload Image API
  const {
    response: uploadedImage,
    isLoading: uploading,
    setRecall: callUploading,
  } = useAPI(post, 'Image/uploadSPImage', payloadUpload);

  // Delete Image API
  const {
    response: deleteResponse,
    isLoading: deletingLoading,
    setRecall: callDeleteImg,
  } = useAPI(deleting, 'Image/deleteSPImage', payloadDelete);

  // Call All Images
  useEffect(() => {
    callCurrentImages(callApi);
  }, [callApi]);

  // handle Uploading
  const handleUpload = (e) => {
    const indexOfComma = e.indexOf(',');
    setPayloadUpload({
      image: e.substring(indexOfComma + 1),
      isDefault: true,
    });
  };

  useEffect(() => {
    if (payloadUpload) {
      callUploading(true);
    }
  }, [payloadUpload]);

  useEffect(() => {
    if (uploadedImage && uploadedImage.error) {
      setResponseError(uploadedImage.error.message);
    }
    if (uploadedImage && uploadedImage.data) {
      setSuccessUploaded(true);
    }
  }, [uploadedImage]);

  // handle Deleting
  const handleDelete = (url) => {
    setPayloadDelete([url]);
    setOpen(false);
  };

  useEffect(() => {
    if (payloadDelete) {
      callDeleteImg(true);
    }
  }, [payloadDelete]);

  useEffect(() => {
    if (deleteResponse && deleteResponse.error) {
      setResponseError(deleteResponse.error.message);
    }
    if (deleteResponse && deleteResponse.data) {
      setSuccessDeleted(true);
    }
  }, [deleteResponse]);

  // handle refresh list
  useEffect(() => {
    callCurrentImages(callApi);
  }, [uploadedImage, deleteResponse]);
  useEffect(() => {
    if (successUploaded) {
      setTimeout(() => {
        setSuccessUploaded(false);
      }, 3000);
    }
    if (successDeleted) {
      setTimeout(() => {
        setSuccessDeleted(false);
      }, 3000);
    }
  }, [successDeleted, successUploaded]);

  return (
    <>
      <h2 className="title mb-2">{messages['admin.settings.SPImages.header']}</h2>
      {successDeleted && (
        <div className={classes.root}>
          <Alert severity="success">
            {messages['admin.settings.SPImages.successDeleted']}{' '}
          </Alert>
        </div>
      )}
      {successUploaded && (
        <div className={classes.root}>
          <Alert severity="success">
            {messages['admin.settings.SPImages.successUploaded']}{' '}
          </Alert>
        </div>
      )}
      {responseError && (
        <div className={classes.root}>
          <Alert severity="warning">{responseError}</Alert>
        </div>
      )}
      <div className="alignBtn mt-3 mb-3 ml-2 mr-2">
        <UploadImage
          onDone={handleUpload}
          className="btn redBg"
          text={
            uploading || deletingLoading || getting
              ? messages['common.loading']
              : messages['admin.settings.SPImages.upload']
          }
          disabled={uploading || deletingLoading || getting}
        />
      </div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{messages['admin.settings.SPImages']}</TableCell>
            <TableCell align="right">{messages['common.actions']}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentImages ? (
            currentImages.data.list.map((image) => (
              <TableRow key={image.image}>
                <TableCell>
                  <img src={image.image} alt={image.image} width="80" />
                </TableCell>
                <TableCell align="right">
                  <button
                    type="button"
                    className="btn redBg"
                    onClick={() => {
                      setSelectedImage(image.image);
                      setOpen(true);
                    }}
                    disabled={uploading || deletingLoading || getting}
                  >
                    <DeleteIcon />
                  </button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow align="left" className="py-4" colSpan="2">
              <TableCell colSpan="4" align="center">
                <CircularProgress size={24} className="mx-auto" color="secondary" />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <DeleteImageModal
        open={open}
        setOpen={setOpen}
        imageUrl={selectedImage}
        onDelete={handleDelete}
      />
    </>
  );
}
