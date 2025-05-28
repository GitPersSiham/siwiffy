import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createUsers, PartialUser } from '@/api/userApi';

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (user: Omit<PartialUser, 'id'>) => createUsers(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
