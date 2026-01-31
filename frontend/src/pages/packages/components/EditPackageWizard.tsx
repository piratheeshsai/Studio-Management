import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Select from '@radix-ui/react-select';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, ChevronRight, ChevronLeft, Package as PackageIcon, Plus, Trash2, ChevronDown, Check, Copy, Tag, FileText, DollarSign, Package2 } from 'lucide-react';
import { toast } from 'sonner';
import { packagesApi, type Package } from '../../../services/api/packages.api';

// Validation schema
const packageSchema = z.object({
    category: z.enum(['WEDDING', 'BIRTHDAY', 'COMMERCIAL', 'CORPORATE', 'MATERNITY', 'PRE_WEDDING', 'ENGAGEMENT', 'BABY_SHOWER', 'OTHER']),
    name: z.string().min(3, 'Name must be at least 3 characters'),
    description: z.string().optional(),
    basePrice: z.number().min(0, 'Price must be positive'),
    items: z.array(z.object({
        name: z.string().min(1, 'Item name is required'),
        type: z.enum(['PRODUCT', 'EVENT']),
        defDimensions: z.string().optional(),
        defPages: z.number().optional(),
        defQuantity: z.number().optional(),
        description: z.string().optional(),
    })).min(1, 'Add at least one item'),
});

type PackageFormData = z.infer<typeof packageSchema>;

interface EditPackageWizardProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    packageData: Package | null;
}

const CATEGORIES = [
    { value: 'WEDDING', label: 'Wedding' },
    { value: 'BIRTHDAY', label: 'Birthday' },
    { value: 'COMMERCIAL', label: 'Commercial' },
    { value: 'CORPORATE', label: 'Corporate' },
    { value: 'MATERNITY', label: 'Maternity' },
    { value: 'PRE_WEDDING', label: 'Pre-Wedding' },
    { value: 'ENGAGEMENT', label: 'Engagement' },
    { value: 'BABY_SHOWER', label: 'Baby Shower' },
    { value: 'OTHER', label: 'Other' },
];

const EditPackageWizard: React.FC<EditPackageWizardProps> = ({ isOpen, onClose, onSuccess, packageData }) => {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, control, watch, formState: { errors }, reset } = useForm<PackageFormData>({
        resolver: zodResolver(packageSchema),
        defaultValues: {
            category: 'WEDDING',
            name: '',
            description: '',
            basePrice: undefined as any,
            items: [{ name: '', type: 'PRODUCT', defQuantity: 1 }],
        },
    });

    const { fields, append, remove, replace } = useFieldArray({
        control,
        name: 'items',
    });

    const formData = watch();

    // Pre-fill form when packageData changes
    useEffect(() => {
        if (packageData && isOpen) {
            reset({
                category: packageData.category as any,
                name: packageData.name,
                description: packageData.description || '',
                basePrice: Number(packageData.basePrice),
                items: packageData.items && packageData.items.length > 0
                    ? packageData.items.map(item => ({
                        name: item.name,
                        type: item.type,
                        defDimensions: item.defDimensions || '',
                        defPages: item.defPages || undefined,
                        defQuantity: item.defQuantity || undefined,
                        description: item.description || '',
                    }))
                    : [{ name: '', type: 'PRODUCT' as const, defQuantity: 1 }],
            });
            setStep(1); // Reset to first step
        }
    }, [packageData, isOpen, reset]);

    const onSubmit = async (data: PackageFormData) => {
        if (!packageData) {
            toast.error('No package selected for editing');
            return;
        }

        try {
            setIsSubmitting(true);

            // Call the API to update the package
            await packagesApi.update(packageData.id, {
                category: data.category,
                name: data.name,
                description: data.description,
                basePrice: data.basePrice,
                items: data.items.map(item => ({
                    name: item.name,
                    type: item.type,
                    defDimensions: item.defDimensions,
                    defPages: item.defPages,
                    defQuantity: item.defQuantity,
                    description: item.description,
                })),
            });

            // Success feedback
            toast.success('Package updated successfully!', {
                description: `"${data.name}" has been updated.`,
            });

            // Reset form and close modal
            reset();
            setStep(1);
            onSuccess(); // Refresh the packages list
            onClose();
        } catch (error: any) {
            // Error handling
            console.error('Failed to update package:', error);

            const errorMessage = error.response?.data?.message ||
                error.message ||
                'Failed to update package. Please try again.';

            toast.error('Update Failed', {
                description: errorMessage,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        reset();
        setStep(1);
        onClose();
    };

    const nextStep = (e?: React.MouseEvent) => {
        e?.preventDefault();
        e?.stopPropagation();
        if (step < 3) setStep(step + 1);
    };

    const prevStep = (e?: React.MouseEvent) => {
        e?.preventDefault();
        e?.stopPropagation();
        if (step > 1) setStep(step - 1);
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                <Dialog.Content className="fixed left-[50%] top-[50%] z-[101] w-full max-w-3xl translate-x-[-50%] translate-y-[-50%] rounded-2xl bg-white dark:bg-gradient-to-b dark:from-[#323237] dark:to-[#111112] shadow-2xl border border-zinc-200 dark:border-white/10 p-0 focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 max-h-[90vh] overflow-hidden flex flex-col">

                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                                <PackageIcon size={20} className="text-white" />
                            </div>
                            <div>
                                <Dialog.Title className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                                    Edit Package
                                </Dialog.Title>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">Step {step} of 3</p>
                            </div>
                        </div>
                        <Dialog.Close asChild>
                            <button className="p-2 hover:bg-zinc-100 dark:hover:bg-white/10 rounded-full transition-colors text-zinc-500">
                                <X size={20} />
                            </button>
                        </Dialog.Close>
                    </div>

                    {/* Progress Bar */}
                    <div className="flex gap-2 px-6 pt-4">
                        {[1, 2, 3].map((s) => (
                            <div
                                key={s}
                                className={`h-1 flex-1 rounded-full transition-all ${s <= step ? 'bg-gradient-to-r from-orange-500 to-orange-600' : 'bg-zinc-200 dark:bg-zinc-700'
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Form Content */}
                    <form
                        onSubmit={(e) => {
                            // Prevent submission if not on final step
                            if (step !== 3) {
                                e.preventDefault();
                                return false;
                            }
                            // Only submit on final step
                            return handleSubmit(onSubmit)(e);
                        }}
                        onInvalid={(e) => {
                            console.log('=== FORM VALIDATION FAILED ===');
                            console.log('Validation errors:', errors);
                            console.log('Invalid element:', e.target);
                        }}
                        className="flex-1 overflow-y-auto"
                    >
                        <div className="p-6 space-y-6">

                            {/* Step 1: Basic Info */}
                            {step === 1 && (
                                <div className="space-y-4 animate-in fade-in-0 slide-in-from-right-5 duration-200">
                                    <h3 className="text-md font-semibold text-zinc-900 dark:text-zinc-100">Package Details</h3>

                                    {/* Two Column Grid for Category and Name */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Category <span className="text-orange-500">*</span></label>
                                            <Controller
                                                name="category"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select.Root value={field.value} onValueChange={field.onChange}>
                                                        <Select.Trigger className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:outline-none text-zinc-900 dark:text-zinc-100 flex items-center justify-between hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors">
                                                            <Select.Value />
                                                            <Select.Icon>
                                                                <ChevronDown size={16} className="text-zinc-500" />
                                                            </Select.Icon>
                                                        </Select.Trigger>
                                                        <Select.Portal>
                                                            <Select.Content className="overflow-hidden bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-white/10 shadow-2xl z-[200]">
                                                                <Select.Viewport className="p-1">
                                                                    {CATEGORIES.map((cat) => (
                                                                        <Select.Item
                                                                            key={cat.value}
                                                                            value={cat.value}
                                                                            className="relative flex items-center px-8 py-2.5 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 outline-none cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-900/20 data-[highlighted]:bg-orange-50 dark:data-[highlighted]:bg-orange-900/20 transition-colors"
                                                                        >
                                                                            <Select.ItemIndicator className="absolute left-2 flex items-center">
                                                                                <Check size={14} className="text-orange-600" />
                                                                            </Select.ItemIndicator>
                                                                            <Select.ItemText>{cat.label}</Select.ItemText>
                                                                        </Select.Item>
                                                                    ))}
                                                                </Select.Viewport>
                                                            </Select.Content>
                                                        </Select.Portal>
                                                    </Select.Root>
                                                )}
                                            />
                                            {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Package Name <span className="text-orange-500">*</span></label>
                                            <input
                                                type="text"
                                                {...register('name')}
                                                placeholder="e.g., Platinum Wedding Package"
                                                className={`w-full px-4 py-2.5 bg-zinc-50 dark:bg-black/20 border rounded-xl focus:ring-2 focus:outline-none transition-colors ${errors.name
                                                    ? 'border-red-300 dark:border-red-500/50 focus:ring-red-500/20'
                                                    : formData.name && formData.name.length >= 3
                                                        ? 'border-green-300 dark:border-green-500/50 focus:ring-green-500/20'
                                                        : 'border-zinc-200 dark:border-white/10 focus:ring-zinc-900/10 dark:focus:ring-white/10'
                                                    }`}
                                            />
                                            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                                        </div>
                                    </div>

                                    {/* Full Width Description */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Description (Optional)</label>
                                        <textarea
                                            {...register('description')}
                                            rows={3}
                                            placeholder="Describe what's included in this package..."
                                            className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10 focus:outline-none resize-none"
                                        />
                                    </div>

                                    {/* Full Width Base Price */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Base Price <span className="text-orange-500">*</span></label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">LKR</span>
                                            <input
                                                type="number"
                                                step="0.01"
                                                {...register('basePrice', { valueAsNumber: true })}
                                                placeholder="0.00"
                                                className={`w-full pl-12 pr-4 py-2.5 bg-zinc-50 dark:bg-black/20 border rounded-xl focus:ring-2 focus:outline-none transition-colors ${errors.basePrice
                                                    ? 'border-red-300 dark:border-red-500/50 focus:ring-red-500/20'
                                                    : formData.basePrice > 0
                                                        ? 'border-green-300 dark:border-green-500/50 focus:ring-green-500/20'
                                                        : 'border-zinc-200 dark:border-white/10 focus:ring-zinc-900/10 dark:focus:ring-white/10'
                                                    }`}
                                            />
                                        </div>
                                        {errors.basePrice && <p className="text-sm text-red-500">{errors.basePrice.message}</p>}
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Add Items */}
                            {step === 2 && (
                                <div className="space-y-4 animate-in fade-in-0 slide-in-from-right-5 duration-200">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-md font-semibold text-zinc-900 dark:text-zinc-100">Package Items</h3>
                                        <button
                                            type="button"
                                            onClick={() => append({ name: '', type: 'PRODUCT', defQuantity: 1 })}
                                            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-orange-500/30"
                                        >
                                            <Plus size={14} />
                                            Add Item
                                        </button>
                                    </div>

                                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                                        {fields.map((field, index) => (
                                            <div key={field.id} className="p-4 bg-zinc-50 dark:bg-black/20 rounded-xl border border-zinc-200 dark:border-white/10 space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Item {index + 1}</span>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const itemToCopy = formData.items[index];
                                                                append({
                                                                    name: itemToCopy.name,
                                                                    type: itemToCopy.type,
                                                                    defDimensions: itemToCopy.defDimensions,
                                                                    defPages: itemToCopy.defPages,
                                                                    defQuantity: itemToCopy.defQuantity,
                                                                    description: itemToCopy.description,
                                                                });
                                                            }}
                                                            className="p-1 hover:bg-orange-100 dark:hover:bg-orange-900/20 rounded text-orange-600 transition-colors"
                                                            title="Duplicate item"
                                                        >
                                                            <Copy size={14} />
                                                        </button>
                                                        {fields.length > 1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => remove(index)}
                                                                className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded text-red-500 transition-colors"
                                                                title="Delete item"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="space-y-1">
                                                        <label className="text-xs text-zinc-600 dark:text-zinc-400">Item Name <span className="text-orange-500">*</span></label>
                                                        <input
                                                            {...register(`items.${index}.name`)}
                                                            placeholder="e.g., Preshoot or Album"
                                                            className="w-full px-3 py-2 bg-white dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                                                        />
                                                    </div>

                                                    <div className="space-y-1">
                                                        <label className="text-xs text-zinc-600 dark:text-zinc-400">Type</label>
                                                        <Controller
                                                            name={`items.${index}.type`}
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Select.Root value={field.value} onValueChange={field.onChange}>
                                                                    <Select.Trigger className="w-full px-3 py-2 bg-white dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-lg text-sm focus:ring-2 focus:ring-orange-500/20 focus:outline-none text-zinc-900 dark:text-zinc-100 flex items-center justify-between hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors">
                                                                        <Select.Value />
                                                                        <Select.Icon>
                                                                            <ChevronDown size={14} className="text-zinc-500" />
                                                                        </Select.Icon>
                                                                    </Select.Trigger>
                                                                    <Select.Portal>
                                                                        <Select.Content className="overflow-hidden bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-white/10 shadow-2xl z-[200]">
                                                                            <Select.Viewport className="p-1">
                                                                                <Select.Item
                                                                                    value="PRODUCT"
                                                                                    className="relative flex items-center px-8 py-2 rounded-md text-sm text-zinc-900 dark:text-zinc-100 outline-none cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-900/20 data-[highlighted]:bg-orange-50 dark:data-[highlighted]:bg-orange-900/20 transition-colors"
                                                                                >
                                                                                    <Select.ItemIndicator className="absolute left-2 flex items-center">
                                                                                        <Check size={12} className="text-orange-600" />
                                                                                    </Select.ItemIndicator>
                                                                                    <Select.ItemText>Product</Select.ItemText>
                                                                                </Select.Item>
                                                                                <Select.Item
                                                                                    value="EVENT"
                                                                                    className="relative flex items-center px-8 py-2 rounded-md text-sm text-zinc-900 dark:text-zinc-100 outline-none cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-900/20 data-[highlighted]:bg-orange-50 dark:data-[highlighted]:bg-orange-900/20 transition-colors"
                                                                                >
                                                                                    <Select.ItemIndicator className="absolute left-2 flex items-center">
                                                                                        <Check size={12} className="text-orange-600" />
                                                                                    </Select.ItemIndicator>
                                                                                    <Select.ItemText>Event</Select.ItemText>
                                                                                </Select.Item>
                                                                            </Select.Viewport>
                                                                        </Select.Content>
                                                                    </Select.Portal>
                                                                </Select.Root>
                                                            )}
                                                        />
                                                    </div>
                                                </div>

                                                {watch(`items.${index}.type`) === 'PRODUCT' && (
                                                    <div className="grid grid-cols-3 gap-3">
                                                        <div className="space-y-1">
                                                            <label className="text-xs text-zinc-600 dark:text-zinc-400">Dimensions</label>
                                                            <input
                                                                {...register(`items.${index}.defDimensions`)}
                                                                placeholder="12x18"
                                                                className="w-full px-3 py-2 bg-white dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-xs text-zinc-600 dark:text-zinc-400">Pages</label>
                                                            <input
                                                                type="number"
                                                                {...register(`items.${index}.defPages`, {
                                                                    setValueAs: (v) => v === '' || isNaN(v) ? undefined : Number(v)
                                                                })}
                                                                placeholder="110"
                                                                className="w-full px-3 py-2 bg-white dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-xs text-zinc-600 dark:text-zinc-400">Quantity</label>
                                                            <input
                                                                type="number"
                                                                {...register(`items.${index}.defQuantity`, {
                                                                    setValueAs: (v) => v === '' || isNaN(v) ? undefined : Number(v)
                                                                })}
                                                                placeholder="1"
                                                                className="w-full px-3 py-2 bg-white dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    {errors.items && <p className="text-sm text-red-500">{errors.items.message}</p>}
                                </div>
                            )}

                            {/* Step 3: Review */}
                            {step === 3 && (
                                <div className="space-y-5 animate-in fade-in-0 slide-in-from-right-5 duration-200">
                                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Review Package</h3>

                                    {/* Package Details */}
                                    <div className="bg-zinc-50 dark:bg-black/20 rounded-xl border border-zinc-200 dark:border-white/10 p-5 space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Category</span>
                                                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-1">{formData.category}</p>
                                            </div>
                                            <div>
                                                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Package Name</span>
                                                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-1">{formData.name}</p>
                                            </div>
                                        </div>

                                        {formData.description && (
                                            <div className="pt-3 border-t border-zinc-200 dark:border-white/10">
                                                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Description</span>
                                                <p className="text-sm text-zinc-700 dark:text-zinc-300 mt-1">{formData.description}</p>
                                            </div>
                                        )}

                                        <div className="pt-3 border-t border-zinc-200 dark:border-white/10">
                                            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Base Price</span>
                                            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                                                LKR {formData.basePrice?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Package Items */}
                                    <div className="bg-zinc-50 dark:bg-black/20 rounded-xl border border-zinc-200 dark:border-white/10 p-5">
                                        <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
                                            Package Items ({formData.items?.length})
                                        </h4>
                                        <div className="space-y-2 max-h-64 overflow-y-auto">
                                            {formData.items?.map((item, index) => (
                                                <div key={index} className="p-3 bg-white dark:bg-black/20 rounded-lg border border-zinc-200 dark:border-white/10">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="font-medium text-sm text-zinc-900 dark:text-zinc-100">{item.name}</span>
                                                        <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs font-medium rounded-md">
                                                            {item.type}
                                                        </span>
                                                    </div>
                                                    {item.type === 'PRODUCT' && (item.defDimensions || item.defPages || item.defQuantity) && (
                                                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                                            {item.defDimensions && item.defDimensions.trim() && `${item.defDimensions}`}
                                                            {item.defPages && !isNaN(item.defPages) && item.defPages > 0 && ` • ${item.defPages} pages`}
                                                            {item.defQuantity && !isNaN(item.defQuantity) && item.defQuantity > 0 && ` • Qty: ${item.defQuantity}`}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer Actions */}
                        <div className="flex gap-3 p-6 border-t border-zinc-100 dark:border-white/5">
                            {step > 1 && (
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl hover:bg-zinc-50 dark:hover:bg-white/10 transition-colors text-zinc-700 dark:text-zinc-300"
                                >
                                    <ChevronLeft size={16} />
                                    Back
                                </button>
                            )}

                            <div className="flex-1" />

                            {step < 3 ? (
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-orange-500/30"
                                >
                                    Next
                                    <ChevronRight size={16} />
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Updating...' : 'Update Package'}
                                </button>
                            )}
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default EditPackageWizard;
