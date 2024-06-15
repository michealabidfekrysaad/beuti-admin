import React, { useState, useEffect } from 'react';
import { Image } from 'react-bootstrap';
import { toAbsoluteUrl } from 'functions/toAbsoluteUrl';
import UploadImage from 'components/shared/UploadImage';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CallAPI } from 'utils/API/APIConfig';
import { useIntl } from 'react-intl';
import moment from 'moment';
import axios from 'axios';
import {
  INSTAGRAM_GET_EP,
  INSTAGRAM_ADD_EP,
} from '../../../../utils/API/EndPoints/ImageEP';

const IWUploadAndLinkInstagram = ({ setNewImage }) => {
  const history = useHistory();
  const { messages } = useIntl();
  const [username, setUsername] = useState('');
  const [instagramCode, setInstagramCode] = useState({
    accessCode: '',
    expiration: '',
    redirectUrl: '',
  });

  // Get Access Token From Backend And Get Username from instagram
  const { refetch: getUsernameCall } = CallAPI({
    name: 'getInstagramAccessToken',
    url: INSTAGRAM_GET_EP,
    enabled: true,
    retry: 0,
    refetchOnWindowFocus: false,
    onSuccess: (res) =>
      res?.data?.data?.data &&
      axios(
        `https://graph.instagram.com/me?fields=username&access_token=${res?.data?.data?.data}`,
      ).then((data) => setUsername(data?.data?.username)),
  });

  // Get Token From Instagram And Send it To Backend
  useEffect(() => {
    const urlFromInstagram = history.location.search;
    if (urlFromInstagram.startsWith('?code=')) {
      setInstagramCode({
        accessCode: urlFromInstagram.substring(urlFromInstagram.indexOf('=') + 1),
        expiration: moment()
          .add('1', 'hour')
          .format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]'),
        redirectUrl: `${window.location.origin}/information/4/`,
      });
    }
    if (urlFromInstagram.startsWith('?error_reason')) {
      toast.error(messages['rw.uploadimages.instagram.denied']);
    }
  }, []);

  const { refetch: sendTokenToBackend } = CallAPI({
    name: 'sendInstagramCodeToken',
    method: 'post',
    url: INSTAGRAM_ADD_EP,
    body: { ...instagramCode },
    onSuccess: (res) => {
      if (res?.data?.data?.data) {
        toast.warning(messages['rw.uploadimages.instagram.upload.backend']);
        getUsernameCall(true);
      }
    },
  });

  useEffect(() => {
    if (instagramCode.accessCode) {
      sendTokenToBackend(true);
    }
  }, [instagramCode]);

  return (
    <section className="iwgallery">
      <a
        type="button"
        className={`iwgallery-instagram ${username && 'dimmed'}`}
        href={`https://api.instagram.com/oauth/authorize?client_id=347651399747138&redirect_uri=${window.location.origin}/information/4/&scope=user_profile,user_media&response_type=code`}
      >
        <Image src={toAbsoluteUrl('/instagram.svg')} />
        <p>{username ? `@${username}` : messages['rw.uploadimages.instagram.link']}</p>
        {username && <i className="flaticon2-check-mark" />}
      </a>
      <UploadImage
        className="iwgallery-upload"
        onDone={setNewImage}
        maxSizeUpload="3000"
        setErrorMessage={(err) => toast.error(err)}
      >
        <Image
          className="iwgallery-upload__image"
          src={toAbsoluteUrl('/uploadimages.svg')}
        />
        <div className="iwgallery-upload__text">
          <p className="iwgallery-upload__text-title">
            {messages['rw.uploadimages.gallery.manually.upload']}
          </p>
          <p className="iwgallery-upload__text-subtitle">
            {messages['rw.uploadimages.gallery.manually.upload.type']}
          </p>
        </div>
      </UploadImage>
    </section>
  );
};
IWUploadAndLinkInstagram.propTypes = {
  setNewImage: PropTypes.func,
};
export default IWUploadAndLinkInstagram;
