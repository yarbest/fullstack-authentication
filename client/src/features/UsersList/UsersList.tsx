import { useCallback } from 'react'

import { useLogoutMutation } from '@shared/api/authApi'
import Button from '@shared/components/Button'

import { useGetUsersQuery } from './store/userApi'

const UsersList = () => {
  const { data: users, refetch } = useGetUsersQuery()
  const [logout] = useLogoutMutation()

  const handleLogout = useCallback(() => {
    localStorage.removeItem('accessToken')
    logout()
  }, [logout])

  return (
    <div>
      <Button text="Logout" onClick={handleLogout} />
      <Button text="Refetch Users" onClick={refetch} />
      <h1>Users</h1>
      <ul>
        {users?.map(user => (
          <li key={user.id}>
            <p>
              Email:
              {' '}
              {user.email}
            </p>
            <p>
              Is email activated:

              <b>
                {user.isEmailActivated ? 'Yes' : 'No'}
              </b>
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default UsersList
