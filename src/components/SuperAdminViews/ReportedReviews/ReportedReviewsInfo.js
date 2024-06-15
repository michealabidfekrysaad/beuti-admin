import React, { useEffect, useState, createRef } from 'react';
import { Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

export function ReportedReviewsInfo({ open, setOpen, dataPiece, setActionSelected }) {
  const [reportId, setReportId] = useState('');
  const [respondRate, setRepsondRate] = useState(null);
  const arrLength = dataPiece?.replies?.length;
  const elRefs = React.useRef([]);
  const styleScroll = {
    maxHeight: '400px',
    overflow: 'hidden',
    overflowY: 'scroll',
  };

  // add or remove refs within map
  if (elRefs.current.length !== arrLength) {
    elRefs.current = Array(arrLength)
      .fill()
      .map((_, i) => elRefs.current[i] || createRef());
  }

  useEffect(() => {
    setReportId(dataPiece?.id);
  }, [open]);

  // happen when choose action from radio btn
  const respondRating = (e) => {
    setRepsondRate({
      reportId,
      spReviewReportActionId: e.target.value,
    });
  };

  // when click on save btn to send request
  const handleSaveBtn = () => {
    if (respondRate) {
      setActionSelected(respondRate);
    }
    setOpen(false);
  };
  const clearData = () => {
    setActionSelected(null);
    setRepsondRate(null);
  };
  // when SP want to see whole commnet due to it's length
  const showAllReply = (id) => {
    if (elRefs.current[id].current.className.includes('text-truncate')) {
      elRefs.current[id].current.classList.remove('text-truncate');
      elRefs.current[id].current.classList.add('text-info');
    } else {
      elRefs.current[id].current.classList.add('text-truncate');
      elRefs.current[id].current.classList.remove('text-info');
    }
  };
  const { messages } = useIntl();
  return (
    <Modal
      onHide={() => {
        clearData();
        setOpen(false);
      }}
      show={open}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="bootstrap-modal-customizing"
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter" className="title">
          {messages['sidebar.sadmin.ReportedReviews']}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-12 m-2 mb-2" style={styleScroll}>
            <>
              {dataPiece?.feedback && (
                <h3 className="text-break">
                  {`${messages[`table.reportedReviews.comments`]}: ${
                    dataPiece?.feedback
                  }`}
                </h3>
              )}
            </>
            <>
              {dataPiece?.replies &&
                dataPiece?.replies?.length !== 0 &&
                dataPiece?.replies.map((reply, i) => (
                  <h3
                    className={
                      reply?.reply?.length > 45
                        ? 'text-truncate fit-content-word text-break'
                        : 'text-break'
                    }
                    key={reply.replyId}
                    ref={elRefs.current[i]}
                    onClick={() => reply?.reply?.length > 45 && showAllReply(i)}
                    onKeyDown={() => reply?.reply?.length > 45 && showAllReply()}
                    role="presentation"
                  >
                    {reply.isSPReply ? reply.spName : reply.customerName}: {reply.reply}
                  </h3>
                ))}
            </>
            <h3>
              {!dataPiece?.feedback &&
                dataPiece?.replies?.length === 0 &&
                messages['table.reportedReviews.noComments']}
            </h3>
          </div>
          <div className="col-12 m-2">
            <div>
              <p>
                <input
                  type="radio"
                  id="keepReview"
                  value="1"
                  name="radio-group"
                  onChange={respondRating}
                />
                <label htmlFor="keepReview">
                  {messages['table.reportedReviews.Keep.review']}
                </label>
              </p>
              <p>
                <input
                  type="radio"
                  id="removeReview"
                  value="2"
                  name="radio-group"
                  onChange={respondRating}
                />
                <label htmlFor="removeReview">
                  {messages['table.reportedReviews.remove.review']}
                </label>
              </p>
              <p>
                <input
                  type="radio"
                  id="removeReviewStar"
                  value="3"
                  name="radio-group"
                  onChange={respondRating}
                />
                <label htmlFor="removeReviewStar">
                  {messages['table.reportedReviews.remove.review.star']}
                </label>
              </p>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button
          className="btn btn-secondary px-4"
          type="button"
          onClick={() => {
            clearData();
            setOpen(false);
          }}
        >
          {messages['common.back']}
        </button>
        {/* this button used for the rating action */}
        <button
          size="lg"
          className="btn btn-primary px-4"
          type="button"
          onClick={handleSaveBtn}
        >
          {messages['common.save']}
        </button>
      </Modal.Footer>
    </Modal>
  );
}

ReportedReviewsInfo.propTypes = {
  setOpen: PropTypes.func,
  open: PropTypes.bool,
  dataPiece: PropTypes.object,
  setActionSelected: PropTypes.object,
};
