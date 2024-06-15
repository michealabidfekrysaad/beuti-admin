/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import useAPI, { get, post, put } from 'hooks/useAPI';
import { useIntl } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { Button } from 'react-bootstrap';

function CategoryMove() {
  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 4,
    },
    paper: {
      padding: theme.spacing(2),
      color: theme.palette.text.secondary,
      boxShadow: 'none',
    },
    paperBtn: {
      padding: theme.spacing(2),
      color: theme.palette.text.secondary,
      textAlign: 'center',
      width: '60%',
      margin: 'auto',
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
      width: '100%',
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));
  const classes = useStyles();
  const { messages, locale } = useIntl();
  const initialMessage =
    locale === 'ar'
      ? 'اختار اولأ النوع العام للخدمة'
      : 'First choose General Center Type';
  const [generalCenterTypeIdOld, setGeneralCenterTypeIdOld] = useState('');
  const [generalCenterTypeIdNew, setGeneralCenterTypeIdNew] = useState('');
  const [atHomeOldGeneral, setAtHomeOldGeneral] = useState(initialMessage);
  const [atHomeNewGeneral, setAtHomeNewGeneral] = useState(initialMessage);
  const [centerTypeIdOld, setCenterTypeIdOld] = useState('');
  const [centerTypeIdNew, setCenterTypeIdNew] = useState('');
  const [categoryOldId, setCategoryOldId] = useState('');
  const [categoryNewId, setCategoryNewId] = useState('');
  const [payload, setPayload] = useState(null);
  const [success, setSuccess] = useState(false);
  const [responseError, setResponseError] = useState('');

  const history = useHistory();

  const { response: gctList, isLoading: getting, setRecall: getGct } = useAPI(
    get,
    `GeneralCenterType/GetGCTTypes`,
  );
  const {
    response: getOldCenterTypes,
    isLoading: loadOldCenterTypes,
    setRecall: recallOldCenterTypes,
  } = useAPI(get, `CenterType/GetCenterTypesByGCTID?GCTID=${generalCenterTypeIdOld}`);
  const {
    response: getNewCenterTypes,
    isLoading: loadNewCenterTypes,
    setRecall: recallNewCenterTypes,
  } = useAPI(get, `CenterType/GetCenterTypesByGCTID?GCTID=${generalCenterTypeIdNew}`);
  const {
    response: getOldCategories,
    isLoading: loadOldCategories,
    setRecall: recallOldCategories,
  } = useAPI(get, `Category/GetCTCategories?CTID=${centerTypeIdOld}`);
  const {
    response: getNewCategories,
    isLoading: loadNewCategories,
    setRecall: recallNewCategories,
  } = useAPI(get, `Category/GetCTCategories?CTID=${centerTypeIdNew}`);
  const {
    response: updateServiceRes,
    isLoading: update,
    setRecall: updateRecall,
  } = useAPI(put, `Category/UpdateServicesCategory`, payload);
  /* -------------------------------------------------------------------------- */
  /*                      to get New center-types-category                      */
  /* -------------------------------------------------------------------------- */
  const handleFirstGCTUserSelection = (e, value) => {
    const generalCenterTypeID = value.props.value;
    gctList.data.list.find((generalType) => generalType.id === generalCenterTypeID);
    if (
      gctList.data.list.find((generalType) => generalType.id === generalCenterTypeID)
        .isHome
    ) {
      setAtHomeOldGeneral(`${messages['table.GCT.atHome']}`);
    } else {
      setAtHomeOldGeneral(`${messages['table.GCT.atSalon']}`);
    }
    setGeneralCenterTypeIdOld(generalCenterTypeID);
    setCenterTypeIdOld(null);
    recallOldCenterTypes(true);
  };
  const handleOldCenterTypesSelection = (e, value) => {
    setCategoryOldId('');
    const centerTypeID = value.props.value;
    setCenterTypeIdOld(centerTypeID);
    recallOldCategories(true);
  };
  const handleOldCategorySelection = (e, value) => {
    const categoryID = value.props.value;
    setCategoryOldId(categoryID);
    setPayload({ oldCategoryId: categoryID, newCategoryId: categoryNewId });
  };
  /* -------------------------------------------------------------------------- */
  /*                      to get new center-types-category                      */
  /* -------------------------------------------------------------------------- */
  const handleSecondGCTUserSelection = (e, value) => {
    const generalCenterTypeID = value.props.value;
    gctList.data.list.find((generalType) => generalType.id === generalCenterTypeID);
    if (
      gctList.data.list.find((generalType) => generalType.id === generalCenterTypeID)
        .isHome
    ) {
      setAtHomeNewGeneral(`${messages['table.GCT.atHome']}`);
    } else {
      setAtHomeNewGeneral(`${messages['table.GCT.atSalon']}`);
    }
    setGeneralCenterTypeIdNew(generalCenterTypeID);
    setCenterTypeIdNew(null);
    recallNewCenterTypes(true);
  };
  const handleNewCenterTypesSelection = (e, value) => {
    setCategoryNewId('');
    const centerTypeID = value.props.value;
    setCenterTypeIdNew(centerTypeID);
    recallNewCategories(true);
  };
  const handleNewCategorySelection = (e, value) => {
    const categoryID = value.props.value;
    setCategoryNewId(categoryID);
    setPayload({ newCategoryId: categoryID, oldCategoryId: categoryOldId });
  };

  const handleSubmit = () => {
    if (categoryOldId && categoryNewId) {
      updateRecall(true);
    }
  };

  useEffect(() => {
    getGct(true);
  }, []);
  useEffect(() => {
    if (updateServiceRes && updateServiceRes.error) {
      setResponseError(updateServiceRes.error.message);
    }
    if (updateServiceRes && updateServiceRes.data && updateServiceRes.data.success) {
      setSuccess(true);
      setTimeout(() => {
        history.goBack();
      }, 2000);
    }
  }, [updateServiceRes]);

  return (
    <>
      {success && (
        <div className="alert alert-success w-75 mx-auto text-center" role="alert">
          {messages['spAdmin.categories.move.successMsg']}
        </div>
      )}
      {responseError && (
        <div className="alert alert-danger w-75 mx-auto text-center" role="alert">
          {responseError}
        </div>
      )}
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={12} justify="space-between" container direction="row">
            <Paper className={classes.paper}>
              <h1 className="moveServiceHeader">
                {messages['spAdmin.categories.move.header']}
              </h1>
            </Paper>
            <Paper className={classes.paper}>
              <Button
                className="px-4 py-2"
                variant="outline-danger"
                onClick={() => {
                  history.goBack();
                }}
              >
                {messages['common.back']}
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <h3 className="moveServiceHeader text-center">{messages['common.from']}</h3>
            <Paper className={classes.paper}>
              <FormControl className={classes.formControl}>
                <h3>{messages['table.categories.generalCenterType']}</h3>
                <Select
                  id="demo-simple-select-general-center"
                  onChange={handleFirstGCTUserSelection}
                >
                  {gctList &&
                    gctList.data.list.map((data) => (
                      <MenuItem key={data.id} value={data.id}>
                        {data.name}
                      </MenuItem>
                    ))}
                </Select>
                {atHomeOldGeneral}
              </FormControl>
              {/* -----------------second input here for old---------------------------- */}
              <FormControl className={classes.formControl}>
                <h4>{messages['table.categories.centerType']}</h4>
                <Select
                  id="demo-simple-select-center-types"
                  onChange={handleOldCenterTypesSelection}
                >
                  {!loadOldCenterTypes &&
                    getOldCenterTypes &&
                    !getOldCenterTypes.error &&
                    getOldCenterTypes.data.list.map((data) => (
                      <MenuItem key={data.id} value={data.id}>
                        {data.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
              {/* ---------------------third input for old---------------------- */}
              <FormControl className={classes.formControl}>
                <h5>{messages['table.categories.categories']}</h5>
                <Select
                  id="demo-simple-select-category"
                  onChange={handleOldCategorySelection}
                >
                  {!loadOldCenterTypes &&
                    getOldCategories &&
                    centerTypeIdOld &&
                    !getOldCategories.error &&
                    getOldCategories.data.list.map((data) => (
                      <MenuItem key={data.id} value={data.id}>
                        {data.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <h3 className="moveServiceHeader text-center">{messages['common.to']}</h3>
            <Paper className={classes.paper}>
              <FormControl className={classes.formControl}>
                <h3>{messages['table.categories.generalCenterType']}</h3>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  onChange={handleSecondGCTUserSelection}
                >
                  {gctList &&
                    gctList.data.list.map((data) => (
                      <MenuItem key={data.id} value={data.id}>
                        {data.name}
                      </MenuItem>
                    ))}
                </Select>
                {atHomeNewGeneral}
              </FormControl>
              {/* -------------------------------second input here for new------------------------- */}
              <FormControl className={classes.formControl}>
                <h4>{messages['table.categories.centerType']}</h4>
                <Select
                  id="demo-simple-select-new-center-types"
                  onChange={handleNewCenterTypesSelection}
                >
                  {!loadOldCenterTypes &&
                    getNewCenterTypes &&
                    !getNewCenterTypes.error &&
                    getNewCenterTypes.data.list.map((data) => (
                      <MenuItem key={data.id} value={data.id}>
                        {data.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
              {/* ----------------------------third input here for new---------------------------- */}
              <FormControl className={classes.formControl}>
                <h5>{messages['table.categories.categories']}</h5>
                <Select
                  id="demo-simple-select-category-new"
                  onChange={handleNewCategorySelection}
                >
                  {!loadNewCenterTypes &&
                    getNewCategories &&
                    centerTypeIdNew &&
                    !getNewCategories.error &&
                    getNewCategories.data.list.map((data) => (
                      <MenuItem key={data.id} value={data.id}>
                        {data.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paperBtn}>
              <Button
                disabled={
                  !centerTypeIdOld ||
                  !centerTypeIdNew ||
                  !categoryOldId ||
                  !categoryNewId ||
                  !(atHomeOldGeneral === atHomeNewGeneral)
                }
                variant="primary"
                block
                onClick={handleSubmit}
              >
                {messages['common.save']}
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} className={classes.paperBtn}>
            {!(atHomeOldGeneral === atHomeNewGeneral) && categoryNewId && categoryOldId && (
              <div className="alert alert-warning w-75 mx-auto" role="alert">
                {messages['spAdmin.categories.move.isHome']}
              </div>
            )}
          </Grid>
          {update && (
            <Grid item xs={12} className={classes.paperBtn}>
              <div className="spinner-border moveServiceHeader" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </Grid>
          )}
        </Grid>
      </div>
    </>
  );
}

export default CategoryMove;
