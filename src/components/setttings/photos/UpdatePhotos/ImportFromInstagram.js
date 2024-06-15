import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import moment from 'moment';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CallAPI } from 'utils/API/APIConfig';
import { INSTAGRAM_ADD_EP, INSTAGRAM_GET_EP } from 'utils/API/EndPoints/ImageEP';
import LinkInstagramModal from './LinkInstagramModal';
import { ImportImagesInstagramModal } from './ImportImagesInstagramModal';
import UnLinkInstagramModal from './unlinkInstagramModal';

const ImportFromInstagram = ({ callGallaryImages }) => {
  const { messages } = useIntl();
  const [username, setUsername] = useState('');
  const [openLinkModal, setOpenLinkModal] = useState(false);
  const [openUnlinkModal, setOpenUnlinkModal] = useState(false);

  const [openImportModal, setOpenImportModal] = useState(false);

  const [instagramCode, setInstagramCode] = useState({
    accessCode: '',
    expiration: '',
    redirectUrl: '',
  });
  const history = useHistory();
  // Get Access Token From Backend And Get Username from instagram
  const { refetch: getUsernameCall, isFetching: gettingUsername } = CallAPI({
    name: 'getInstagramAccessToken',
    url: INSTAGRAM_GET_EP,
    enabled: true,
    retry: 0,
    refetchOnWindowFocus: false,
    onSuccess: (res) =>
      res?.data?.data?.data &&
      axios(
        `https://graph.instagram.com/me?fields=username&access_token=${res?.data?.data?.data}`,
      ).then((data) => {
        callGallaryImages(true);
        setUsername(data?.data?.username);
      }),
    onError: (err) => err && setUsername(''),
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
        redirectUrl: `${window.location.origin}/settings/photos/`,
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
    <>
      <button
        className="updatephotos__featured--upload-instagram"
        type="button"
        disabled={gettingUsername}
        onClick={() => (username ? setOpenImportModal(true) : setOpenLinkModal(true))}
      >
        {messages['setting.photos.gallary.import']}
      </button>
      <LinkInstagramModal openModal={openLinkModal} setOpenModal={setOpenLinkModal} />
      <ImportImagesInstagramModal
        openModal={!!username && openImportModal}
        setOpenModal={setOpenImportModal}
        setOpenUnlinkModal={setOpenUnlinkModal}
        username={username}
        callGallaryImages={callGallaryImages}
      />
      <UnLinkInstagramModal
        openModal={openUnlinkModal}
        setOpenModal={setOpenUnlinkModal}
        setUsername={setUsername}
      />
    </>
  );
};
ImportFromInstagram.propTypes = {
  callGallaryImages: PropTypes.func,
};

export default ImportFromInstagram;
