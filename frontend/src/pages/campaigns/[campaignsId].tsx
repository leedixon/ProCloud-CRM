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

import { update, fetch } from '../../stores/campaigns/campaignsSlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';

import { hasPermission } from '../../helpers/userPermissions';

const EditCampaigns = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initVals = {
    name: '',

    target_amount: '',

    start_date: new Date(),

    end_date: new Date(),

    donations_received: [],

    organization: '',
  };
  const [initialValues, setInitialValues] = useState(initVals);

  const { campaigns } = useAppSelector((state) => state.campaigns);

  const { currentUser } = useAppSelector((state) => state.auth);

  const { campaignsId } = router.query;

  useEffect(() => {
    dispatch(fetch({ id: campaignsId }));
  }, [campaignsId]);

  useEffect(() => {
    if (typeof campaigns === 'object') {
      setInitialValues(campaigns);
    }
  }, [campaigns]);

  useEffect(() => {
    if (typeof campaigns === 'object') {
      const newInitialVal = { ...initVals };

      Object.keys(initVals).forEach(
        (el) => (newInitialVal[el] = campaigns[el] || ''),
      );

      setInitialValues(newInitialVal);
    }
  }, [campaigns]);

  const handleSubmit = async (data) => {
    await dispatch(update({ id: campaignsId, data }));
    await router.push('/campaigns/campaigns-list');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit campaigns')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={'Edit campaigns'}
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
              <FormField label='Name'>
                <Field name='name' placeholder='Name' />
              </FormField>

              <FormField label='TargetAmount'>
                <Field
                  type='number'
                  name='target_amount'
                  placeholder='TargetAmount'
                />
              </FormField>

              <FormField label='StartDate'>
                <DatePicker
                  dateFormat='yyyy-MM-dd hh:mm'
                  showTimeSelect
                  selected={
                    initialValues.start_date
                      ? new Date(
                          dayjs(initialValues.start_date).format(
                            'YYYY-MM-DD hh:mm',
                          ),
                        )
                      : null
                  }
                  onChange={(date) =>
                    setInitialValues({ ...initialValues, start_date: date })
                  }
                />
              </FormField>

              <FormField label='EndDate'>
                <DatePicker
                  dateFormat='yyyy-MM-dd hh:mm'
                  showTimeSelect
                  selected={
                    initialValues.end_date
                      ? new Date(
                          dayjs(initialValues.end_date).format(
                            'YYYY-MM-DD hh:mm',
                          ),
                        )
                      : null
                  }
                  onChange={(date) =>
                    setInitialValues({ ...initialValues, end_date: date })
                  }
                />
              </FormField>

              <FormField
                label='DonationsReceived'
                labelFor='donations_received'
              >
                <Field
                  name='donations_received'
                  id='donations_received'
                  component={SelectFieldMany}
                  options={initialValues.donations_received}
                  itemRef={'donations'}
                  showField={'amount'}
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
                  onClick={() => router.push('/campaigns/campaigns-list')}
                />
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  );
};

EditCampaigns.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'UPDATE_CAMPAIGNS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default EditCampaigns;
