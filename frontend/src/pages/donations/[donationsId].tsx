import { mdiChartTimelineVariant, mdiUpload } from '@mdi/js';
import Head from 'next/head';
import React, { ReactElement, useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';

import CardBox from '../../components/CardBox';
import LayoutAuthenticated from '../../layouts/Authenticated';
import SectionMain from '../../components/SectionMain';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import { getPageTitle } from '../../config';

import { Field, Form, Formik } from 'formik';
import FormField from '../../components/FormField';
import BaseDivider from '../../components/BaseDivider';
import BaseButtons from '../../components/BaseButtons';
import BaseButton from '../../components/BaseButton';
import FormCheckRadio from '../../components/FormCheckRadio';
import FormCheckRadioGroup from '../../components/FormCheckRadioGroup';
import FormFilePicker from '../../components/FormFilePicker';
import FormImagePicker from '../../components/FormImagePicker';
import { SelectField } from '../../components/SelectField';
import { SelectFieldMany } from '../../components/SelectFieldMany';
import { SwitchField } from '../../components/SwitchField';
import { RichTextField } from '../../components/RichTextField';

import { update, fetch } from '../../stores/donations/donationsSlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';

import { hasPermission } from '../../helpers/userPermissions';

const EditDonations = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initVals = {
    amount: '',

    donation_date: new Date(),

    method: '',

    donor: '',

    organization: '',
  };
  const [initialValues, setInitialValues] = useState(initVals);

  const { donations } = useAppSelector((state) => state.donations);

  const { currentUser } = useAppSelector((state) => state.auth);

  const { donationsId } = router.query;

  useEffect(() => {
    dispatch(fetch({ id: donationsId }));
  }, [donationsId]);

  useEffect(() => {
    if (typeof donations === 'object') {
      setInitialValues(donations);
    }
  }, [donations]);

  useEffect(() => {
    if (typeof donations === 'object') {
      const newInitialVal = { ...initVals };

      Object.keys(initVals).forEach(
        (el) => (newInitialVal[el] = donations[el] || ''),
      );

      setInitialValues(newInitialVal);
    }
  }, [donations]);

  const handleSubmit = async (data) => {
    await dispatch(update({ id: donationsId, data }));
    await router.push('/donations/donations-list');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit donations')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={'Edit donations'}
          main
        >
          {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values) => handleSubmit(values)}
          >
            <Form>
              <FormField label='Amount'>
                <Field type='number' name='amount' placeholder='Amount' />
              </FormField>

              <FormField label='DonationDate'>
                <DatePicker
                  dateFormat='yyyy-MM-dd hh:mm'
                  showTimeSelect
                  selected={
                    initialValues.donation_date
                      ? new Date(
                          dayjs(initialValues.donation_date).format(
                            'YYYY-MM-DD hh:mm',
                          ),
                        )
                      : null
                  }
                  onChange={(date) =>
                    setInitialValues({ ...initialValues, donation_date: date })
                  }
                />
              </FormField>

              <FormField label='Method'>
                <Field name='method' placeholder='Method' />
              </FormField>

              <FormField label='Donor' labelFor='donor'>
                <Field
                  name='donor'
                  id='donor'
                  component={SelectField}
                  options={initialValues.donor}
                  itemRef={'donors'}
                  showField={'name'}
                ></Field>
              </FormField>

              {hasPermission(currentUser, 'READ_ORGANIZATIONS') && (
                <FormField label='organization' labelFor='organization'>
                  <Field
                    name='organization'
                    id='organization'
                    component={SelectField}
                    options={initialValues.organization}
                    itemRef={'organizations'}
                    showField={'name'}
                  ></Field>
                </FormField>
              )}

              <BaseDivider />
              <BaseButtons>
                <BaseButton type='submit' color='info' label='Submit' />
                <BaseButton type='reset' color='info' outline label='Reset' />
                <BaseButton
                  type='reset'
                  color='danger'
                  outline
                  label='Cancel'
                  onClick={() => router.push('/donations/donations-list')}
                />
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  );
};

EditDonations.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'UPDATE_DONATIONS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default EditDonations;
