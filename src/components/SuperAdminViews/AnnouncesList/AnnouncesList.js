/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable indent */
import React, { useEffect, useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import useAPI, { get, post } from 'hooks/useAPI';
import { formatDate } from 'functions/formatTableData';
import Loading from 'components/AdminViews/NewBooking/Loading/shimmer';
import { Card, Button } from 'react-bootstrap';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import SendAnnounces from './SendAnnounce';

export function AnnounceList() {
  const { locale, messages } = useIntl();
  const [announceList, setAnnounceList] = useState([]);
  const [open, setOpen] = useState(false);
  const { response, isLoading, setRecall } = useAPI(get, 'Announcement/GetAnnounceList');

  const [sentTo, setSentTo] = useState('1');
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [error] = useState('');
  const [success, setSuccess] = useState('');
  const [imageSrc, setImageSrc] = useState('');

  const { response: postRes, isLoading: sending, setRecall: send } = useAPI(
    post,
    'Announcement/Add',
    {
      content: text,
      announcementType: +sentTo,
      image: imageSrc.substring(imageSrc.indexOf(',') + 1),
      title,
    },
  );
  const handleChange = (e) => setSentTo(e.target.value);

  useEffect(() => {
    setRecall(true);
  }, []);

  useEffect(() => {
    if (response?.data) {
      setAnnounceList(response.data?.list);
      setImageSrc('');
      setText('');
      setTitle('');
      setSentTo('1');
    }
  }, [response]);

  useEffect(() => {
    if (postRes?.data) {
      setSuccess(true);
      setRecall(true);
      setOpen(false);
      setImageSrc('');
      setTimeout(() => {
        setSuccess(false);
      }, 2000);
    }
  }, [postRes]);

  return (
    <>
      <Card className="mb-5">
        <Card.Header>
          <div className="title"> {messages['sidebar.sadmin.announces']}</div>
          <Button onClick={() => setOpen(true)}>
            <FormattedMessage id="send.triggerBtn" />
          </Button>
        </Card.Header>
        <Card.Body>
          {success && (
            <Alert className="align-items-center" severity="success">
              {messages['announces.success']}
            </Alert>
          )}
          {error && (
            <Alert className="align-items-center" severity="error">
              {error}
            </Alert>
          )}
          {announceList.length > 0 && (
            <Table celled color="purple" textAlign="center">
              <TableHead>
                <TableRow>
                  <TableCell align="left">{messages['common.title']}</TableCell>
                  <TableCell align="left">{messages['announces.content']}</TableCell>
                  <TableCell align="left">{messages['announces.who']}</TableCell>
                  <TableCell align="left">{messages['announces.createdDate']}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {announceList.map((aanounce) => (
                  <TableRow key={aanounce.id}>
                    <TableCell align="left">{aanounce.title || '-'}</TableCell>

                    <TableCell align="left">{aanounce.content}</TableCell>
                    <TableCell align="left">{aanounce.type.name}</TableCell>
                    <TableCell align="left">
                      {formatDate(aanounce.createdDate, locale)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {isLoading && <Loading />}
        </Card.Body>
      </Card>
      <SendAnnounces
        handleChange={handleChange}
        setText={setText}
        sentTo={sentTo}
        title={title}
        setTitle={setTitle}
        open={open}
        setImageSrc={setImageSrc}
        imageSrc={imageSrc}
        setOpen={setOpen}
        sending={sending}
        text={text}
        send={send}
      />
    </>
  );
}
