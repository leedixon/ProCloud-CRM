import {
  mdiAccount,
  mdiChartTimelineVariant,
  mdiMail,
  mdiUpload,
} from '@mdi/js';
import Head from 'next/head';
import React, { ReactElement } from 'react';
import 'react-toastify/dist/ReactToastify.min.css';
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
import { SwitchField } from '../../components/SwitchField';

import { SelectField } from '../../components/SelectField';
import { SelectFieldMany } from '../../components/SelectFieldMany';
import { RichTextField } from '../../components/RichTextField';

import { create } from '../../stores/campaigns/campaignsSlice';
import { useAppDispatch } from '../../stores/hooks';
import { useRouter } from 'next/router';
import moment from 'moment';

const initialValues = {
  name: '',

  target_amount: '',

  start_date: '',

  end_date: '',

  donations_received: [],

  organization: '',
};

const CampaignsNew = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleSubmit = async (data) => {
    await dispatch(create(data));
    await router.push('/campaigns/campaigns-list');
  };
  return (
    <>
      <Head>
        <title>{getPageTitle('New Item')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title='New Item'
          main
        >
          {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
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
                <Field
                  type='datetime-local'
                  name='start_date'
                  placeholder='StartDate'
                />
              </FormField>

              <FormField label='EndDate'>
                <Field
                  type='datetime-local'
                  name='end_date'
                  placeholder='EndDate'
                />
              </FormField>

              <FormField
                label='DonationsReceived'
                labelFor='donations_received'
              >
                <Field
                  name='donations_received'
                  id='donations_received'
                  itemRef={'donations'}
                  options={[]}
                  component={SelectFieldMany}
                ></Field>
              </FormField>

              <FormField label='organization' labelFor='organization'>
                <Field
                  name='organization'
                  id='organization'
                  component={SelectField}
                  options={[]}
                  itemRef={'organizations'}
                ></Field>
              </FormField>

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

CampaignsNew.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'CREATE_CAMPAIGNS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default CampaignsNew;
