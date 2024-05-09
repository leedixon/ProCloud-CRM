import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head';
import 'react-toastify/dist/ReactToastify.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { fetch } from '../../stores/volunteers/volunteersSlice';
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

const VolunteersView = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { volunteers } = useAppSelector((state) => state.volunteers);

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
        <title>{getPageTitle('View volunteers')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={removeLastCharacter('View volunteers')}
          main
        >
          {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Name</p>
            <p>{volunteers?.name}</p>
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Email</p>
            <p>{volunteers?.email}</p>
          </div>

          <>
            <p className={'block font-bold mb-2'}>EventsAttended</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>

                      <th>StartDate</th>

                      <th>EndDate</th>

                      <th>Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {volunteers.events_attended &&
                      Array.isArray(volunteers.events_attended) &&
                      volunteers.events_attended.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(`/events/events-view/?id=${item.id}`)
                          }
                        >
                          <td data-label='title'>{item.title}</td>

                          <td data-label='start_date'>
                            {dataFormatter.dateTimeFormatter(item.start_date)}
                          </td>

                          <td data-label='end_date'>
                            {dataFormatter.dateTimeFormatter(item.end_date)}
                          </td>

                          <td data-label='location'>{item.location}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!volunteers?.events_attended?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          {hasPermission(currentUser, 'READ_ORGANIZATIONS') && (
            <div className={'mb-4'}>
              <p className={'block font-bold mb-2'}>organization</p>

              <p>{volunteers?.organization?.name ?? 'No data'}</p>
            </div>
          )}

          <BaseDivider />

          <BaseButton
            color='info'
            label='Back'
            onClick={() => router.push('/volunteers/volunteers-list')}
          />
        </CardBox>
      </SectionMain>
    </>
  );
};

VolunteersView.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'READ_VOLUNTEERS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default VolunteersView;
