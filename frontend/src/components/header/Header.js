import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import authService from '../../services/authService';
import { getUser, RESET, selectUser, SET_LOGIN } from '../../redux/features/auth/authSlice';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  const logout = async (e) => {
    dispatch(RESET());
    await authService.logoutUser();
    await dispatch(SET_LOGIN(false));
    navigate("/login");
  };

  useEffect(() => {
    if (!user) {
      dispatch(getUser());
    }
  }, [dispatch, user]);

  return (
    <div className='--pad header'>
      <div className='--flex-between'>
        <h3>
          <span className='--fw-thin'>Welcome &nbsp;</span>
          <span className='--color-danger'>{user?.name}</span>
        </h3>

        <button className='--btn --btn-danger' onClick={logout}>
          Logout
        </button>
      </div>
      <hr/>
    </div>
  )
}

export default Header