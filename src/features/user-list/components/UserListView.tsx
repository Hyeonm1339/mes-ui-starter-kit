import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { format } from "date-fns";
import { formatDate } from "@/lib/date";
import {
  AppPageLayout,
  AppSection,
  AppButton,
  AppForm,
  AppInput,
  AppSelect,
  AppDatePicker,
  AppDataGrid,
  AppBadge,
} from "@hyeonm1339/mes-ui-kit";
import type { EditableColumn, SelectOption } from "@hyeonm1339/mes-ui-kit";
import { useUserList } from "../hooks/useUserList";
import { useUserMutations } from "../hooks/useUserMutations";
import { UserFormModal } from "./UserFormModal";
import { UserResetPasswordDialog } from "./UserResetPasswordDialog";
import type {
  UserItem,
  UserCreateReq,
  UserModifyReq,
  UserSearchForm,
} from "../types";

// ─── 검색 옵션 ────────────────────────────────────────────────────────────────
const roleOptions: SelectOption[] = [
  { label: "관리자", value: "ADMIN" },
  { label: "사용자", value: "USER" },
];
const statusOptions: SelectOption[] = [
  { label: "활성", value: "Y" },
  { label: "비활성", value: "N" },
];

const defaultSearchValues: UserSearchForm = {
  userId: "",
  userName: "",
  role: "",
  status: "",
  createdAtRange: undefined,
  lastLoginAtRange: undefined,
};

const toDateStr = (d?: Date) => (d ? format(d, "yyyy-MM-dd") : "");

// ─── 그리드 컬럼 ──────────────────────────────────────────────────────────────
const columns: EditableColumn<UserItem>[] = [
  { accessorKey: "userId", header: "사용자 ID", readOnly: true, width: 130 },
  { accessorKey: "userName", header: "사용자명", readOnly: true, width: 120 },
  {
    accessorKey: "role",
    header: "역할",
    readOnly: true,
    width: 90,
    align: "center",
    render: ({ row }) => (
      <AppBadge variant={row.role === "ADMIN" ? "default" : "secondary"}>
        {row.role === "ADMIN" ? "관리자" : "사용자"}
      </AppBadge>
    ),
  },
  {
    accessorKey: "status",
    header: "상태",
    readOnly: true,
    width: 80,
    align: "center",
    render: ({ row }) => (
      <AppBadge variant={row.status === "Y" ? "default" : "destructive"}>
        {row.status === "Y" ? "활성" : "비활성"}
      </AppBadge>
    ),
  },
  {
    accessorKey: "loginFailCount",
    header: "로그인 실패",
    readOnly: true,
    width: 100,
    align: "center",
  },
  {
    accessorKey: "lastLoginAt",
    header: "마지막 로그인",
    readOnly: true,
    width: 160,
    align: "center",
    render: ({ row }) => formatDate(row.lastLoginAt, "yyyy-MM-dd HH:mm:ss"),
  },
  {
    accessorKey: "createdAt",
    header: "등록일",
    readOnly: true,
    width: 160,
    align: "center",
    render: ({ row }) => formatDate(row.createdAt, "yyyy-MM-dd HH:mm:ss"),
  },
];

// ─── 메인 뷰 ─────────────────────────────────────────────────────────────────
export const UserListView = () => {
  const { data, page, isLoading, size, submitSearch, handlePageChange, handleSortChange } =
    useUserList();
  const { createMutation, modifyMutation, resetPasswordMutation } =
    useUserMutations();

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [resetTargetId, setResetTargetId] = useState<string | null>(null);

  // ─── 검색 ────────────────────────────────────────────────────────────────
  const searchForm = useForm<UserSearchForm>({
    defaultValues: defaultSearchValues,
  });

  const onSearch = searchForm.handleSubmit((formData) => {
    submitSearch({
      userId: formData.userId,
      userName: formData.userName,
      role: formData.role,
      status: formData.status,
      createdAtFrom: toDateStr(formData.createdAtRange?.from),
      createdAtTo: toDateStr(formData.createdAtRange?.to),
      lastLoginAtFrom: toDateStr(formData.lastLoginAtRange?.from),
      lastLoginAtTo: toDateStr(formData.lastLoginAtRange?.to),
    });
  });

  const onSearchReset = () => {
    searchForm.reset(defaultSearchValues);
    submitSearch({});
  };

  // ─── 신규 등록 ───────────────────────────────────────────────────────────
  const handleNewClick = () => {
    setSelectedUser(null);
    setFormModalOpen(true);
  };

  // ─── 행 클릭 → 수정 ──────────────────────────────────────────────────────
  const handleRowClick = (row: UserItem) => {
    setSelectedUser(row);
    setFormModalOpen(true);
  };

  // ─── 모달 저장 ───────────────────────────────────────────────────────────
  const handleCreate = (data: UserCreateReq) => {
    createMutation.mutate(data, { onSuccess: () => setFormModalOpen(false) });
  };

  const handleEdit = (data: UserModifyReq) => {
    if (!selectedUser) return;
    modifyMutation.mutate(
      { userId: selectedUser.userId, req: data },
      { onSuccess: () => setFormModalOpen(false) },
    );
  };

  // ─── 비밀번호 초기화 ──────────────────────────────────────────────────────
  const handleResetPassword = (userId: string) => {
    resetPasswordMutation.mutate(userId, {
      onSuccess: () => setResetTargetId(null),
    });
  };

  return (
    <>
      <AppPageLayout
        search={
          <AppForm labelAlign="top" onSubmit={onSearch}>
            <AppSection
              title="검색 조건"
              cols={6}
              actions={
                <div className="flex gap-2">
                  <AppButton
                    type="button"
                    variant="outline"
                    onClick={onSearchReset}
                  >
                    초기화
                  </AppButton>
                  <AppButton type="submit">조회</AppButton>
                </div>
              }
            >
              <AppInput
                label="사용자 ID"
                placeholder="사용자 ID"
                {...searchForm.register("userId")}
              />
              <AppInput
                label="사용자명"
                placeholder="사용자명"
                {...searchForm.register("userName")}
              />
              <Controller
                name="role"
                control={searchForm.control}
                render={({ field }) => (
                  <AppSelect
                    label="역할"
                    clearable
                    options={roleOptions}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              <Controller
                name="status"
                control={searchForm.control}
                render={({ field }) => (
                  <AppSelect
                    label="상태"
                    clearable
                    options={statusOptions}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              <Controller
                name="createdAtRange"
                control={searchForm.control}
                render={({ field }) => (
                  <AppDatePicker
                    label="가입일"
                    mode="range"
                    clearable
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              <Controller
                name="lastLoginAtRange"
                control={searchForm.control}
                render={({ field }) => (
                  <AppDatePicker
                    label="마지막 로그인"
                    mode="range"
                    clearable
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </AppSection>
          </AppForm>
        }
        grid={
          <AppSection
            title="회원 목록"
            actions={<AppButton onClick={handleNewClick}>신규 등록</AppButton>}
          >
            <AppDataGrid
              columns={columns}
              data={data}
              loading={isLoading}
              pagination
              sortable
              filterable
              serverSort
              serverPagination
              totalCount={page?.total}
              columnReorderable
              pageSize={size}
              onPageChange={handlePageChange}
              onSortChange={handleSortChange}
              onRowDoubleClick={handleRowClick}
              height={500}
              exportable
              exportFileName="회원목록"
              emptyMessage="조회된 회원이 없습니다."
            />
          </AppSection>
        }
      />

      <UserFormModal
        open={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        user={selectedUser}
        isSaving={createMutation.isPending || modifyMutation.isPending}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onResetPassword={setResetTargetId}
      />

      <UserResetPasswordDialog
        userId={resetTargetId}
        isLoading={resetPasswordMutation.isPending}
        onClose={() => setResetTargetId(null)}
        onConfirm={handleResetPassword}
      />
    </>
  );
};
