import React, { useEffect } from 'react'
import { FaUsers } from 'react-icons/fa'
import { BiUserCheck, BiUserMinus, BiUserX } from 'react-icons/bi'

import './UserStats.scss'
import InfoBox from '../../components/infoBox/InfoBox'
import { useDispatch, useSelector } from 'react-redux'
import { 
  CALC_VERIFIED_USERS, 
  CALC_SUSPENDED_USERS
} from '../../redux/features/auth/authSlice'

// Icons
const icon1 = <FaUsers size={40} color="#fff" />;
const icon2 = <BiUserCheck size={40} color="#fff" />;
const icon3 = <BiUserMinus size={40} color="#fff" />;
const icon4 = <BiUserX size={40} color="#fff" />;

const UserStats = () => {
  const dispatch = useDispatch();
  const { users, verifiedUsers, suspendedUsers } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    //console.log(users);
    dispatch(CALC_VERIFIED_USERS());
    dispatch(CALC_SUSPENDED_USERS());
  }, [dispatch, users]);

  const unverifiedUsers = users?.length - verifiedUsers;

  return (
    <div className='user-summary'>
      <h3 className='--mt'>User Stats</h3>
      <div className='info-summary'>
        <InfoBox
          icon={icon1}
          title={'Total Users'}
          count={users?.length}
          bgColor='card1'
        />

        <InfoBox
          icon={icon2}
          title={'Verified Users'}
          count={verifiedUsers}
          bgColor='card2'
        />

        <InfoBox
          icon={icon3}
          title={'Unverified Users'}
          count={unverifiedUsers}
          bgColor='card3'
        />

        <InfoBox
          icon={icon4}
          title={'Suspended Users'}
          count={suspendedUsers}
          bgColor='card4'
        />
      </div>
    </div>
  )
}

export default UserStats