import React, { useContext, useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { useForm } from 'react-hook-form';
import { handleImageString } from 'functions/toAbsoluteUrl';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { get } from 'lodash';
import { useHistory, useParams } from 'react-router-dom';
import { SP_VAT } from 'utils/API/EndPoints/ServiceProviderEP';
import ProductDetails from './AddEditProduct/ProductDetails';
import ProductPricing from './AddEditProduct/ProductPricing';
import { CallAPI } from '../../../utils/API/APIConfig';
import { SP_GET_USER_BRANCHES } from '../../../utils/API/EndPoints/BranchManager';
import ProductDescrption from './AddEditProduct/ProductDescrptio';
import ProductLowStock from './AddEditProduct/ProductLowStock';
import ProductBranches from './AddEditProduct/ProductBranches';
import { AddProductSchema, EditProductSchema } from './AddEditProduct/ProductSchema';
import { filterBranchesSelected } from './Helper/FilterBranches';
import { BranchesContext } from '../../../providers/BranchesSelections';

const AddProduct = () => {
  const { messages } = useIntl();
  const history = useHistory();
  const { productId } = useParams();
  const { branches } = useContext(BranchesContext);
  const [errorUploadImg, setErrorUploadImg] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm({
    mode: 'all',
    resolver: yupResolver(productId ? EditProductSchema : AddProductSchema),
  });
  const { data: AllBranches } = CallAPI({
    name: ['getAllBranches', branches],
    url: SP_GET_USER_BRANCHES,
    refetchOnWindowFocus: false,
    enabled: true,
    onSuccess: (branchesList) => !productId && setValue('Branches', branchesList),
    select: (res) =>
      res?.data?.data?.list.map((branch) =>
        branches.find((id) => +branch.id === +id)
          ? { ...branch, isSelected: true }
          : { ...branch, isSelected: false },
      ),
  });
  CallAPI({
    name: 'getBranchVat',
    url: SP_VAT,
    refetchOnWindowFocus: false,
    enabled: true,
    onSuccess: (res) => setValue('vat', res),
    select: (res) => res?.data?.data.vatValue,
  });
  const { refetch: addProductCall, isFetching: addProductLoading } = CallAPI({
    name: 'AddProduct',
    url: productId ? 'Product/UpdateProduct' : 'Product/addNewProduct',
    method: productId ? 'put' : 'post',
    body: {
      ...watch(),
      Branches: filterBranchesSelected(
        watch('Branches'),
        watch('quantity'),
      )?.map((branchele) =>
        branchele.Quantity ? { ...branchele } : { ...branchele, Quantity: 0 },
      ),
      image: handleImageString(watch('image')),
      productId: +productId || undefined,
      quantity: watch('quantity') || 0,
      parcode: watch('parcode') || null,
    },
    onSuccess: (res) => {
      if (res?.data?.data?.success) {
        history.push('/productList/0');
        toast.success(
          productId
            ? messages['product.add.editedSuccessfully']
            : messages['product.add.addedSuccessfully'],
        );
      }
    },
    onError: (err) => toast.error(err?.response?.data?.error?.message),
  });
  CallAPI({
    name: ['getCurrentProduct', productId],
    url: 'Product/getProduct',
    refetchOnWindowFocus: false,
    enabled: !!productId,
    query: {
      productId,
    },
    onSuccess: (res) => {
      setValue('image', res.image, { shouldValidate: true });
      setValue('nameAR', res.nameAR, { shouldValidate: true });
      setValue('nameEN', res.nameEN, { shouldValidate: true });
      setValue('parcode', res.parcode || '');
      setValue('price', res.price);
      setValue('quantity', res.quantity || '');
      setValue('lowStockAlert', res.lowStockAlert || '');
      setValue('description', res.description || '');
      setValue('vat', res.branchVAT || 0);
    },
    select: (data) => data?.data?.data,
  });
  const emptyNameAndPhone = (e) => {
    if (!watch('nameAR') && !watch('nameEN') && !watch('price')) {
      toast.error(messages['products.empty.name.price']);
    }
  };
  const handleAddProductSubmit = () => {
    if (!errorUploadImg) return addProductCall(true);
    return null;
  };
  useEffect(() => {
    if (watch) {
      const subscription = watch((value, { name }) => {
        if (name.includes('isSelected')) {
          if (get(value, name.substring(0, name.indexOf('.'))).quantity) {
            setValue(`${name.substring(0, name.indexOf('.'))}.quantity`, '');
            clearErrors(`${name.substring(0, name.indexOf('.'))}.quantity`);
          }
        }
      });
      return () => subscription.unsubscribe();
    }
    return null;
  }, [watch]);
  return (
    <form onSubmit={handleSubmit(handleAddProductSubmit, emptyNameAndPhone)}>
      <Row className="settings">
        <Col xs={12} className="settings__section">
          <ProductDetails
            errors={errors}
            register={register}
            watch={watch}
            setValue={setValue}
            errorUploadImg={errorUploadImg}
            setErrorUploadImg={setErrorUploadImg}
          />
        </Col>
        <Col xs={12} className="settings__section">
          <ProductPricing
            errors={errors}
            register={register}
            watch={watch}
            setValue={setValue}
            AllBranches={AllBranches}
          />
        </Col>
        <Col xs={12} className="settings__section">
          <ProductBranches
            errors={errors}
            register={register}
            watch={watch}
            setValue={setValue}
            AllBranches={watch('Branches')}
          />
        </Col>
        <Col xs={12} className="settings__section">
          <ProductLowStock errors={errors} register={register} />
        </Col>
        <Col xs={12} className="settings__section">
          <ProductDescrption
            errors={errors}
            register={register}
            watch={watch}
            setValue={setValue}
          />
        </Col>
      </Row>
      <section className="settings__submit">
        <button
          className="beutibuttonempty mx-2 action"
          type="button"
          onClick={() => history.goBack()}
          disabled={addProductLoading}
        >
          {messages['common.cancel']}
        </button>
        <button className="beutibutton action" type="submit" disabled={addProductLoading}>
          {messages['common.save']}
        </button>
      </section>
    </form>
  );
};

export default AddProduct;
