import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head';
import 'react-toastify/dist/ReactToastify.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { fetch } from '../../stores/campaigns/campaignsSlice';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';
import LayoutAuthenticated from '../../layouts/Authenticated';
import { getPageTitle } from '../../config';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import SectionMain from '../../components/SectionMain';
import CardBox from '../../components/CardBox';
import BaseButton from '../../components/BaseButton';
import BaseDivider from '../../components/BaseDivider';
import { mdiChartTimelineVariant } from '@mdi/js';
import { SwitchField } from '../../components/SwitchField';
import FormField from '../../components/FormField';

import { hasPermission } from '../../helpers/userPermissions';

const CampaignsView = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { campaigns } = useAppSelector((state) => state.campaigns);

  const { currentUser } = useAppSelector((state) => state.auth);

  const { id } = router.query;

  function removeLastCharacter(str) {
    console.log(str, `str`);
    return str.slice(0, -1);
  }

  useEffect(() => {
    dispatch(fetch({ id }));
  }, [dispatch, id]);

  return (
    <>
      <Head>
        <title>{getPageTitle('View campaigns')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={removeLastCharacter('View campaigns')}
          main
        >
          {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Name</p>
            <p>{campaigns?.name}</p>
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>TargetAmount</p>
            <p>{campaigns?.target_amount || 'No data'}</p>
          </div>

          <FormField label='StartDate'>
            {campaigns.start_date ? (
              <DatePicker
                dateFormat='yyyy-MM-dd hh:mm'
                showTimeSelect
                selected={
                  campaigns.start_date
                    ? new Date(
                        dayjs(campaigns.start_date).format('YYYY-MM-DD hh:mm'),
                      )
                    : null
                }
                disabled
              />
            ) : (
              <p>No StartDate</p>
            )}
          </FormField>

          <FormField label='EndDate'>
            {campaigns.end_date ? (
              <DatePicker
                dateFormat='yyyy-MM-dd hh:mm'
                showTimeSelect
                selected={
                  campaigns.end_date
                    ? new Date(
                        dayjs(campaigns.end_date).format('YYYY-MM-DD hh:mm'),
                      )
                    : null
                }
                disabled
              />
            ) : (
              <p>No EndDate</p>
            )}
          </FormField>

          <>
            <p className={'block font-bold mb-2'}>DonationsReceived</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>Amount</th>

                      <th>DonationDate</th>

                      <th>Method</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.donations_received &&
                      Array.isArray(campaigns.donations_received) &&
                      campaigns.donations_received.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(
                              `/donations/donations-view/?id=${item.id}`,
                            )
                          }
                        >
                          <td data-label='amount'>{item.amount}</td>

                          <td data-label='donation_date'>
                            {dataFormatter.dateTimeFormatter(
                              item.donation_date,
                            )}
                          </td>

                          <td data-label='method'>{item.method}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!campaigns?.donations_received?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          {hasPermission(currentUser, 'READ_ORGANIZATIONS') && (
            <div className={'mb-4'}>
              <p className={'block font-bold mb-2'}>organization</p>

              <p>{campaigns?.organization?.name ?? 'No data'}</p>
            </div>
          )}

          <BaseDivider />

          <BaseButton
            color='info'
            label='Back'
            onClick={() => router.push('/campaigns/campaigns-list')}
          />
        </CardBox>
      </SectionMain>
    </>
  );
};

CampaignsView.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'READ_CAMPAIGNS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default CampaignsView;
