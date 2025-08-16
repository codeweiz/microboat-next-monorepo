"use client";

import { UserAvatar } from "@microboat/web/components/shared/user-avatar";
import { Button } from "@microboat/web/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@microboat/web/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@microboat/web/components/ui/dropdown-menu";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@microboat/web/components/ui/form";
import { Input } from "@microboat/web/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@microboat/web/components/ui/select";
import { Skeleton } from "@microboat/web/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@microboat/web/components/ui/table";
import { Textarea } from "@microboat/web/components/ui/textarea";
import { getUsersAction } from "@microboat/web/lib/actions/list-users";
import { authClient } from "@microboat/web/lib/auth/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
	type ColumnDef,
	type SortingState,
	type VisibilityState,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import {
	ArrowUpDownIcon,
	Ban,
	ChevronDownIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	ChevronsLeftIcon,
	ChevronsRightIcon,
	MoreHorizontal,
	Shield,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Define User type based on database schema
type User = {
	id: string;
	name: string;
	email: string;
	emailVerified: boolean;
	image?: string;
	createdAt: Date;
	updatedAt: Date;
	customerId?: string;
	role?: string;
	banned?: boolean;
	banReason?: string;
	banExpires?: Date;
	locale?: string;
};

// Form schemas
const searchFormSchema = z.object({
	search: z.string(),
});

const banFormSchema = z.object({
	banReason: z.string().min(1, "Ban reason is required"),
	banDuration: z.enum([
		"permanent",
		"1hour",
		"1day",
		"1week",
		"1month",
		"custom",
	]),
	customDuration: z.number().min(1).optional(),
});

type SearchFormValues = z.infer<typeof searchFormSchema>;
type BanFormValues = z.infer<typeof banFormSchema>;

interface DataTableColumnHeaderProps<TData, TValue>
	extends React.HTMLAttributes<HTMLDivElement> {
	column: any;
	title: string;
}

function DataTableColumnHeader<TData, TValue>({
	column,
	title,
	className,
}: DataTableColumnHeaderProps<TData, TValue>) {
	if (!column.getCanSort()) {
		return <div className={className}>{title}</div>;
	}

	return (
		<div className={className}>
			<Button
				variant="ghost"
				className="cursor-pointer flex items-center gap-2"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
			>
				{title}
				<ArrowUpDownIcon className="h-4 w-4" />
			</Button>
		</div>
	);
}

export function UsersTable() {
	const t = useTranslations("menu");
	const router = useRouter();
	const searchParams = useSearchParams();
	const queryClient = useQueryClient();

	const [pageIndex, setPageIndex] = useState(0);
	const [pageSize, setPageSize] = useState(10);
	const [debouncedSearch, setDebouncedSearch] = useState(
		searchParams.get("search") || "",
	);
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

	// Dialog state
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);

	// Search form
	const searchForm = useForm<SearchFormValues>({
		resolver: zodResolver(searchFormSchema),
		defaultValues: {
			search: searchParams.get("search") || "",
		},
	});

	// Ban form
	const banForm = useForm<BanFormValues>({
		resolver: zodResolver(banFormSchema),
		defaultValues: {
			banReason: "",
			banDuration: "permanent",
			customDuration: 1,
		},
	});

	const searchValue = searchForm.watch("search");
	const banDuration = banForm.watch("banDuration");

	// Search debounce
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearch(searchValue);
		}, 1000);

		return () => clearTimeout(timer);
	}, [searchValue]);

	// Update URL when debounced search changes
	useEffect(() => {
		const params = new URLSearchParams(searchParams);
		if (debouncedSearch) {
			params.set("search", debouncedSearch);
		} else {
			params.delete("search");
		}
		router.replace(`?${params.toString()}`, { scroll: false });
	}, [debouncedSearch, searchParams, router]);

	// Fetch users with React Query
	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["users", pageIndex, pageSize, debouncedSearch, sorting],
		queryFn: () =>
			getUsersAction({
				pageIndex,
				pageSize,
				search: debouncedSearch,
				sorting,
			}),
		staleTime: 30000,
		retry: 1,
	});

	const users = data?.data?.items || [];
	const total = data?.data?.total || 0;

	const formatDate = (date: Date) => {
		return new Intl.DateTimeFormat("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		}).format(new Date(date));
	};

	const columns: ColumnDef<User>[] = [
		{
			accessorKey: "name",
			enableSorting: true,
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Name" />
			),
			cell: ({ row }) => {
				const user = row.original;
				return (
					<div className="flex items-center gap-2 pl-3">
						<UserAvatar
							name={user.name}
							image={user.image}
							className="size-8 border"
						/>
						<span>{user.name}</span>
					</div>
				);
			},
		},
		{
			accessorKey: "email",
			enableSorting: false,
			header: ({ column }) => <div className="pl-3">Email</div>,
			cell: ({ row }) => {
				const user = row.original;
				return (
					<div className="flex items-center gap-2 pl-3">
						<Button
							variant="ghost"
							size="sm"
							className="cursor-pointer p-0 h-auto font-normal"
							onClick={() => {
								navigator.clipboard.writeText(user.email);
								toast.success("Email copied to clipboard");
							}}
						>
							{user.email}
						</Button>
					</div>
				);
			},
		},
		{
			accessorKey: "role",
			enableSorting: true,
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Role" />
			),
			cell: ({ row }) => {
				const user = row.original;
				const role = user.role || "user";
				return (
					<div className="flex items-center gap-2 pl-3">
						<span className="text-sm">
							{role === "admin" ? "Admin" : "User"}
						</span>
					</div>
				);
			},
		},
		{
			accessorKey: "customerId",
			enableSorting: false,
			header: ({ column }) => <div className="pl-3">Customer ID</div>,
			cell: ({ row }) => {
				const user = row.original;
				return (
					<div className="flex items-center gap-2 pl-3">
						{user.customerId ? (
							<Button
								variant="ghost"
								size="sm"
								className="font-mono text-sm cursor-pointer p-0 h-auto font-normal"
								onClick={() => {
									navigator.clipboard.writeText(user.customerId || "");
									toast.success("Customer ID copied to clipboard");
								}}
							>
								{user.customerId || "-"}
							</Button>
						) : (
							<span className="text-muted-foreground">-</span>
						)}
					</div>
				);
			},
		},
		{
			accessorKey: "createdAt",
			enableSorting: true,
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Created At" />
			),
			cell: ({ row }) => {
				const user = row.original;
				return (
					<div className="flex items-center gap-2 pl-3">
						{formatDate(user.createdAt)}
					</div>
				);
			},
		},
		{
			accessorKey: "banned",
			enableSorting: false,
			header: ({ column }) => <div className="pl-3">Status</div>,
			cell: ({ row }) => {
				const user = row.original;
				const getStatus = () => {
					if (user.banned) {
						return "Banned";
					}
					if (!user.emailVerified) {
						return "Not Verified";
					}
					return "Active";
				};
				return (
					<div className="flex items-center gap-2 pl-3">
						<span className="text-sm">{getStatus()}</span>
					</div>
				);
			},
		},
		{
			id: "actions",
			enableSorting: false,
			header: ({ column }) => <div className="pl-3">Actions</div>,
			cell: ({ row }) => {
				const user = row.original;

				return (
					<div className="flex items-center gap-2 pl-3">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
									<MoreHorizontal className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								{!user.banned ? (
									<DropdownMenuItem
										onClick={() => {
											setSelectedUser(user);
											setIsBanDialogOpen(true);
										}}
									>
										<Ban className="mr-2 h-4 w-4" />
										Ban User
									</DropdownMenuItem>
								) : (
									<DropdownMenuItem
										onClick={async () => {
											try {
												const { error } = await authClient.admin.unbanUser({
													userId: user.id,
												});
												if (error) {
													toast.error(error.message || "Failed to unban user");
													return;
												}
												toast.success(`User ${user.name} has been unbanned`);
												queryClient.invalidateQueries({ queryKey: ["users"] });
											} catch (error) {
												console.error("Unban user error:", error);
												toast.error("Failed to unban user");
											}
										}}
									>
										<Shield className="mr-2 h-4 w-4" />
										Unban User
									</DropdownMenuItem>
								)}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				);
			},
		},
	];

	const table = useReactTable({
		data: users,
		columns,
		pageCount: Math.ceil(total / pageSize),
		state: {
			sorting,
			columnVisibility,
			pagination: { pageIndex, pageSize },
		},
		onSortingChange: setSorting,
		onColumnVisibilityChange: setColumnVisibility,
		onPaginationChange: (updater) => {
			const next =
				typeof updater === "function"
					? updater({ pageIndex, pageSize })
					: updater;
			if (next.pageIndex !== pageIndex) {
				setPageIndex(next.pageIndex);
			}
			if (next.pageSize !== pageSize) {
				setPageSize(next.pageSize);
			}
		},
		getCoreRowModel: getCoreRowModel(),
		manualPagination: true,
		manualSorting: true,
	});

	const onBanSubmit = async (data: BanFormValues) => {
		if (!selectedUser) {
			return;
		}

		try {
			let banExpiresIn: number | undefined = undefined;
			switch (data.banDuration) {
				case "1hour":
					banExpiresIn = 60 * 60;
					break;
				case "1day":
					banExpiresIn = 24 * 60 * 60;
					break;
				case "1week":
					banExpiresIn = 7 * 24 * 60 * 60;
					break;
				case "1month":
					banExpiresIn = 30 * 24 * 60 * 60;
					break;
				case "custom":
					banExpiresIn = data.customDuration
						? data.customDuration * 24 * 60 * 60
						: undefined;
					break;
				case "permanent":
					banExpiresIn = undefined;
					break;
			}

			const { error } = await authClient.admin.banUser({
				userId: selectedUser.id,
				banReason: data.banReason.trim(),
				banExpiresIn,
			});

			if (error) {
				toast.error(error.message || "Failed to ban user");
				return;
			}

			toast.success(`User ${selectedUser.name} has been banned`);
			banForm.reset();
			queryClient.invalidateQueries({ queryKey: ["users"] });
			setIsBanDialogOpen(false); // Close dialog on success
		} catch (error) {
			console.error("Ban user error:", error);
			toast.error("Failed to ban user");
		}
	};

	if (isError) {
		return (
			<div className="p-4 text-center text-red-500">
				<h3 className="font-semibold">Error loading users</h3>
				<p className="text-sm mt-1">
					{error instanceof Error ? error.message : "Unknown error occurred"}
				</p>
				<Button
					variant="outline"
					size="sm"
					className="mt-2"
					onClick={() => window.location.reload()}
				>
					Retry
				</Button>
			</div>
		);
	}

	// Render skeleton pagination if loading
	const renderPagination = () => {
		if (isLoading) {
			return (
				<div className="flex items-center justify-between px-4">
					<div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
						<Skeleton className="h-4 w-48" />
					</div>
					<div className="flex w-full items-center gap-8 lg:w-fit">
						<div className="hidden items-center gap-2 lg:flex">
							<Skeleton className="h-4 w-20" />
							<Skeleton className="h-8 w-16 rounded-md" />
						</div>
						<Skeleton className="h-4 w-24" />
						<div className="ml-auto flex items-center gap-2 lg:ml-0">
							<Skeleton className="h-8 w-8 rounded-md" />
							<Skeleton className="h-8 w-8 rounded-md" />
							<Skeleton className="h-8 w-8 rounded-md" />
							<Skeleton className="h-8 w-8 rounded-md" />
							<Skeleton className="h-8 w-8 rounded-md" />
							<Skeleton className="h-8 w-8 rounded-md" />
							<Skeleton className="h-8 w-8 rounded-md" />
							<Skeleton className="h-8 w-8 rounded-md" />
						</div>
					</div>
				</div>
			);
		}

		// Render actual pagination
		return (
			<div className="flex items-center justify-between px-4">
				<div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
					{total > 0 && (
						<span>
							Showing {pageIndex * pageSize + 1} to{" "}
							{Math.min((pageIndex + 1) * pageSize, total)} of {total} users
						</span>
					)}
				</div>
				<div className="flex w-full items-center gap-8 lg:w-fit">
					<div className="hidden items-center gap-2 lg:flex">
						<span className="text-sm font-medium">Rows per page</span>
						<Select
							value={`${pageSize}`}
							onValueChange={(value) => {
								setPageSize(Number(value));
								setPageIndex(0);
							}}
							disabled={isLoading}
						>
							<SelectTrigger
								size="sm"
								className="w-20 cursor-pointer"
								id="rows-per-page"
							>
								<SelectValue placeholder={pageSize} />
							</SelectTrigger>
							<SelectContent side="top">
								{[10, 20, 30, 40, 50].map((size) => (
									<SelectItem key={size} value={`${size}`}>
										{size}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="flex w-fit items-center justify-center text-sm font-medium">
						Page {pageIndex + 1} of {Math.max(1, Math.ceil(total / pageSize))}
					</div>
					<div className="ml-auto flex items-center gap-2 lg:ml-0">
						<Button
							variant="outline"
							className="cursor-pointer hidden h-8 w-8 p-0 lg:flex"
							onClick={() => setPageIndex(0)}
							disabled={pageIndex === 0 || isLoading}
						>
							<span className="sr-only">Go to first page</span>
							<ChevronsLeftIcon className="h-4 w-4" />
						</Button>
						<Button
							variant="outline"
							className="cursor-pointer h-8 w-8 p-0"
							onClick={() => setPageIndex(pageIndex - 1)}
							disabled={pageIndex === 0 || isLoading}
						>
							<span className="sr-only">Go to previous page</span>
							<ChevronLeftIcon className="h-4 w-4" />
						</Button>
						<Button
							variant="outline"
							className="cursor-pointer h-8 w-8 p-0"
							onClick={() => setPageIndex(pageIndex + 1)}
							disabled={
								pageIndex + 1 >= Math.ceil(total / pageSize) || isLoading
							}
						>
							<span className="sr-only">Go to next page</span>
							<ChevronRightIcon className="h-4 w-4" />
						</Button>
						<Button
							variant="outline"
							className="cursor-pointer hidden h-8 w-8 p-0 lg:flex"
							onClick={() =>
								setPageIndex(Math.max(0, Math.ceil(total / pageSize) - 1))
							}
							disabled={
								pageIndex + 1 >= Math.ceil(total / pageSize) || isLoading
							}
						>
							<span className="sr-only">Go to last page</span>
							<ChevronsRightIcon className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</div>
		);
	};

	// Render skeleton table content if loading
	const renderTableContent = () => {
		if (isLoading) {
			return (
				<>
					<TableHeader className="bg-muted sticky top-0 z-10">
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>Role</TableHead>
							<TableHead>Customer ID</TableHead>
							<TableHead>Created At</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{Array.from({ length: 8 }).map((_, index) => (
							<TableRow key={index}>
								{/* Name column with avatar */}
								<TableCell className="py-4">
									<div className="flex items-center gap-2 pl-3">
										<Skeleton className="size-8 rounded-full shrink-0" />
										<Skeleton className="h-4 w-32" />
									</div>
								</TableCell>
								{/* Email column */}
								<TableCell className="py-4">
									<div className="flex items-center gap-2 pl-3">
										<Skeleton className="h-4 w-48" />
									</div>
								</TableCell>
								{/* Role column */}
								<TableCell className="py-4">
									<div className="flex items-center gap-2 pl-3">
										<Skeleton className="h-4 w-16" />
									</div>
								</TableCell>
								{/* Customer ID column */}
								<TableCell className="py-4">
									<div className="flex items-center gap-2 pl-3">
										<Skeleton className="h-4 w-28" />
									</div>
								</TableCell>
								{/* Created At column */}
								<TableCell className="py-4">
									<div className="flex items-center gap-2 pl-3">
										<Skeleton className="h-4 w-32" />
									</div>
								</TableCell>
								{/* Status column */}
								<TableCell className="py-4">
									<div className="flex items-center gap-2 pl-3">
										<Skeleton className="h-4 w-20" />
									</div>
								</TableCell>
								{/* Actions column */}
								<TableCell className="py-4">
									<div className="flex items-center gap-2 pl-3">
										<Skeleton className="h-8 w-8 rounded-md" />
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</>
			);
		}

		// Render actual table content
		return (
			<>
				<TableHeader className="bg-muted sticky top-0 z-10">
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => {
								return (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)}
									</TableHead>
								);
							})}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row) => (
							<TableRow
								key={row.id}
								data-state={row.getIsSelected() && "selected"}
							>
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id} className="py-4">
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell colSpan={columns.length} className="h-24 text-center">
								No users found.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</>
		);
	};

	return (
		<div className="w-full flex-col justify-start gap-6 space-y-4">
			<div className="flex items-center justify-between px-4 lg:px-6 gap-4">
				<div className="flex flex-1 items-center gap-4">
					<Input
						placeholder="Search users..."
						{...searchForm.register("search")}
						onChange={(event) => {
							searchForm.setValue("search", event.target.value);
							setPageIndex(0);
						}}
						className="max-w-sm"
						disabled={isLoading}
					/>
				</div>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="outline"
							size="sm"
							className="cursor-pointer"
							disabled={isLoading}
						>
							<span className="inline">Columns</span>
							<ChevronDownIcon className="w-4 h-4 ml-1" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-56">
						{table
							.getAllColumns()
							.filter((column) => column.getCanHide())
							.map((column) => {
								return (
									<DropdownMenuItem
										key={column.id}
										className="capitalize cursor-pointer"
										onClick={() =>
											column.toggleVisibility(column.getIsVisible())
										}
									>
										{column.id}
									</DropdownMenuItem>
								);
							})}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
				<div className="overflow-hidden rounded-lg border">
					<Table>{renderTableContent()}</Table>
				</div>
				{renderPagination()}
			</div>

			<Dialog open={isBanDialogOpen} onOpenChange={setIsBanDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Ban User</DialogTitle>
						<DialogDescription>
							Are you sure you want to ban user "{selectedUser?.name}"? This
							action will prevent them from accessing the application.
						</DialogDescription>
					</DialogHeader>
					<Form {...banForm}>
						<form
							onSubmit={banForm.handleSubmit(onBanSubmit)}
							className="grid gap-4 py-4"
						>
							{/* FormField for banReason */}
							<FormField
								control={banForm.control}
								name="banReason"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Ban Reason</FormLabel>
										<FormControl>
											<Textarea
												placeholder="Please provide a reason for banning this user..."
												{...field}
												className="min-h-[80px]"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							{/* FormField for banDuration */}
							<FormField
								control={banForm.control}
								name="banDuration"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Ban Duration</FormLabel>
										<Select onValueChange={field.onChange} value={field.value}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select duration" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="permanent">Permanent</SelectItem>
												<SelectItem value="1hour">1 Hour</SelectItem>
												<SelectItem value="1day">1 Day</SelectItem>
												<SelectItem value="1week">1 Week</SelectItem>
												<SelectItem value="1month">1 Month</SelectItem>
												<SelectItem value="custom">Custom</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							{/* FormField for customDuration */}
							{banDuration === "custom" && (
								<FormField
									control={banForm.control}
									name="customDuration"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Custom Duration (days)</FormLabel>
											<div className="flex gap-2 items-center">
												<FormControl>
													<Input
														type="number"
														min="1"
														{...field}
														onChange={(e) =>
															field.onChange(Number(e.target.value))
														}
														className="w-20"
													/>
												</FormControl>
												<span className="text-sm text-muted-foreground">
													days
												</span>
											</div>
											<FormMessage />
										</FormItem>
									)}
								/>
							)}
							<DialogFooter>
								<DialogClose asChild>
									<Button type="button" variant="outline">
										Cancel
									</Button>
								</DialogClose>
								<Button
									type="submit"
									className="bg-red-600 hover:bg-red-700"
									disabled={banForm.formState.isSubmitting}
								>
									{banForm.formState.isSubmitting ? "Banning..." : "Ban User"}
								</Button>
							</DialogFooter>
						</form>
					</Form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
