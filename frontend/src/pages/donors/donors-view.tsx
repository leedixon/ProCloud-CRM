import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head';
import 'react-toastify/dist/ReactToastify.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { fetch } from '../../stores/donors/donorsSlice';
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

const DonorsView = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { donors } = useAppSelector((state) => state.donors);

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
        <title>{getPageTitle('View donors')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={removeLastCharacter('View donors')}
          main
        >
          {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Name</p>
            <p>{donors?.name}</p>
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Email</p>
            <p>{donors?.email}</p>
          </div>

          <FormField label='Birthday'>
            {donors.birthday ? (
              <DatePicker
                dateFormat='yyyy-MM-dd hh:mm'
                showTimeSelect
                selected={
                  donors.birthday
                    ? new Date(
                        dayjs(donors.birthday).format('YYYY-MM-DD hh:mm'),
                      )
                    : null
                }
                disabled
              />
            ) : (
              <p>No Birthday</p>
            )}
          </FormField>

          <>
            <p className={'block font-bold mb-2'}>Donations</p>
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
                    {donors.donations &&
                      Array.isArray(donors.donations) &&
                      donors.donations.map((item: any) => (
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
              {!donors?.donations?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          {hasPermission(currentUser, 'READ_ORGANIZATIONS') && (
            <div className={'mb-4'}>
              <p className={'block font-bold mb-2'}>organization</p>

              <p>{donors?.organization?.name ?? 'No data'}</p>
            </div>
          )}

          <>
            <p className={'block font-bold mb-2'}>Donations Donor</p>
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
                    {donors.donations_donor &&
                      Array.isArray(donors.donations_donor) &&
                      donors.donations_donor.map((item: any) => (
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
              {!donors?.donations_donor?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <BaseDivider />

          <BaseButton
            color='info'
            label='Back'
            onClick={() => router.push('/donors/donors-list')}
          />
        </CardBox>
      </SectionMain>
    </>
  );
};

DonorsView.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'READ_DONORS'}>{page}</LayoutAuthenticated>
  );
};

export default DonorsView;
