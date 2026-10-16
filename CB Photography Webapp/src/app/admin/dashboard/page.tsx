"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  getAllBookings,
  getPhotographers,
  updateBooking,
  deleteBooking,
  createBooking,
  addPhotographer,
  updatePhotographer,
  deletePhotographer,
  getExpenses,
  addExpense,
  deleteExpense,
  getServices,
  updatePackagePrice,
  updatePackage,
  addPackage,
  deletePackage,
  createService,
  updateService
} from "@/lib/api";
import { Booking, BookingStatus, PaymentStatus } from "@/types/booking";
import { Photographer } from "@/types/user";
import { Service, PackageOption } from "@/types/service";
import { Expense, ExpenseCategory } from "@/types/expense";
import { formatCurrency } from "@/lib/utils";
import {
  Calendar,
  DollarSign,
  Plus,
  CheckCircle2,
  Edit2,
  Trash2,
  X,
  FilePlus,
  Receipt,
  TrendingUp,
  Search,
  UserX,
  Package,
  Clock,
  Camera,
  Upload,
  Check,
  RotateCcw,
  FolderPlus,
  ShieldCheck,
  ExternalLink,
  LogOut
} from "lucide-react";
import { fetchCurrentUser, logoutUser, AuthUser } from "@/lib/auth";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [photographers, setPhotographers] = useState<Photographer[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<"overview" | "bookings" | "financials" | "team" | "packages">("overview");

  // Filter & Search state for Bookings
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Packages & Pricing Filter and Search state
  const [packageFilterService, setPackageFilterService] = useState<string>("all");
  const [packageSearch, setPackageSearch] = useState<string>("");
  const [inlinePricePkgId, setInlinePricePkgId] = useState<string | null>(null);
  const [inlinePriceValue, setInlinePriceValue] = useState<number | string>("");

  // Add Package Modal State
  const [showAddPackageModal, setShowAddPackageModal] = useState<boolean>(false);
  const [newPkgServiceId, setNewPkgServiceId] = useState<string>("");
  const [newPkgName, setNewPkgName] = useState<string>("");
  const [newPkgTagline, setNewPkgTagline] = useState<string>("");
  const [newPkgPrice, setNewPkgPrice] = useState<number>(2500);
  const [newPkgDuration, setNewPkgDuration] = useState<number>(2);
  const [newPkgImages, setNewPkgImages] = useState<number>(50);
  const [newPkgFeatures, setNewPkgFeatures] = useState<string>("");
  const [newPkgPopular, setNewPkgPopular] = useState<boolean>(false);
  const [newPkgImageUrl, setNewPkgImageUrl] = useState<string>("");
  const [isSubmittingPackage, setIsSubmittingPackage] = useState<boolean>(false);

  // Edit Package Modal State
  const [editingPackage, setEditingPackage] = useState<{ serviceId: string; package: PackageOption } | null>(null);
  const [editPkgName, setEditPkgName] = useState<string>("");
  const [editPkgTagline, setEditPkgTagline] = useState<string>("");
  const [editPkgPrice, setEditPkgPrice] = useState<number>(2500);
  const [editPkgDuration, setEditPkgDuration] = useState<number>(2);
  const [editPkgImages, setEditPkgImages] = useState<number>(50);
  const [editPkgFeatures, setEditPkgFeatures] = useState<string>("");
  const [editPkgPopular, setEditPkgPopular] = useState<boolean>(false);
  const [editPkgImageUrl, setEditPkgImageUrl] = useState<string>("");
  const [isSavingPackageEdit, setIsSavingPackageEdit] = useState<boolean>(false);

  // New Service Category Modal State
  const [showAddServiceModal, setShowAddServiceModal] = useState<boolean>(false);
  const [newServiceTitle, setNewServiceTitle] = useState<string>("");
  const [newServiceTagline, setNewServiceTagline] = useState<string>("");
  const [newServiceDescription, setNewServiceDescription] = useState<string>("");
  const [newServiceImageUrl, setNewServiceImageUrl] = useState<string>("/backgrounds/demo-wedding.jpg");
  const [newServiceTierName, setNewServiceTierName] = useState<string>("Standard Package");
  const [newServiceTierPrice, setNewServiceTierPrice] = useState<number>(2500);
  const [newServiceTierDuration, setNewServiceTierDuration] = useState<number>(1.5);
  const [newServiceTierImages, setNewServiceTierImages] = useState<number>(40);
  const [isSubmittingService, setIsSubmittingService] = useState<boolean>(false);

  // Edit Service Category Modal State
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editServiceTitle, setEditServiceTitle] = useState<string>("");
  const [editServiceTagline, setEditServiceTagline] = useState<string>("");
  const [editServiceDescription, setEditServiceDescription] = useState<string>("");
  const [editServiceImageUrl, setEditServiceImageUrl] = useState<string>("");
  const [isSavingServiceEdit, setIsSavingServiceEdit] = useState<boolean>(false);

  // Photographer Profile Edit Modal State
  const [editingPhotographer, setEditingPhotographer] = useState<Photographer | null>(null);
  const [editPhotoName, setEditPhotoName] = useState<string>("");
  const [editPhotoRole, setEditPhotoRole] = useState<string>("");
  const [editPhotoIsLead, setEditPhotoIsLead] = useState<boolean>(false);
  const [editPhotoEmail, setEditPhotoEmail] = useState<string>("");
  const [editPhotoPhone, setEditPhotoPhone] = useState<string>("");
  const [editPhotoInstagram, setEditPhotoInstagram] = useState<string>("");
  const [editPhotoBio, setEditPhotoBio] = useState<string>("");
  const [editPhotoSpecialties, setEditPhotoSpecialties] = useState<string>("");
  const [editPhotoRating, setEditPhotoRating] = useState<number>(5.0);
  const [editPhotoCompletedShoots, setEditPhotoCompletedShoots] = useState<number>(0);
  const [editPhotoAvatarUrl, setEditPhotoAvatarUrl] = useState<string>("");
  const [editPhotoAvailableDays, setEditPhotoAvailableDays] = useState<string[]>([]);
  const [isSavingPhotographer, setIsSavingPhotographer] = useState<boolean>(false);

  // Edit Booking Modal State
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [editStatus, setEditStatus] = useState<BookingStatus>("Confirmed");
  const [editPaymentStatus, setEditPaymentStatus] = useState<PaymentStatus>("Deposit Paid");
  const [editDate, setEditDate] = useState<string>("");
  const [editTimeSlot, setEditTimeSlot] = useState<string>("");
  const [editPhotographerId, setEditPhotographerId] = useState<string>("");
  const [editGalleryUrl, setEditGalleryUrl] = useState<string>("");
  const [editNotes, setEditNotes] = useState<string>("");
  const [isSavingEdit, setIsSavingEdit] = useState<boolean>(false);

  // Quick Manual Booking State
  const [showCreateBooking, setShowCreateBooking] = useState(false);
  const [manualClientName, setManualClientName] = useState("");
  const [manualClientEmail, setManualClientEmail] = useState("");
  const [manualClientPhone, setManualClientPhone] = useState("+27 ");
  const [manualPackageName, setManualPackageName] = useState("Signature Editorial (2 Hours)");
  const [manualDate, setManualDate] = useState(new Date().toISOString().split("T")[0]);
  const [manualTimeSlot, setManualTimeSlot] = useState("15:30 - 17:30 (Golden Hour)");
  const [manualPhotographerId, setManualPhotographerId] = useState("");
  const [manualVenue, setManualVenue] = useState("Walter Sisulu Botanical Gardens");
  const [manualPriceZAR, setManualPriceZAR] = useState(3800);
  const [isCreatingManual, setIsCreatingManual] = useState(false);

  // New Photographer Form State
  const [showAddPhotoModal, setShowAddPhotoModal] = useState(false);
  const [newPhotoName, setNewPhotoName] = useState("");
  const [newPhotoEmail, setNewPhotoEmail] = useState("");
  const [newPhotoPhone, setNewPhotoPhone] = useState("+27 ");
  const [newPhotoInstagram, setNewPhotoInstagram] = useState("");
  const [newPhotoSpecialties, setNewPhotoSpecialties] = useState("Weddings, Editorial, Portraits");
  const [newPhotoRole, setNewPhotoRole] = useState("Photographer");
  const [newPhotoBio, setNewPhotoBio] = useState("");
  const [newPhotoAvatarUrl, setNewPhotoAvatarUrl] = useState("/backgrounds/miah-portrait.jpg");
  const [isSubmittingPhoto, setIsSubmittingPhoto] = useState(false);

  // Expense Form State
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [expenseTitle, setExpenseTitle] = useState("");
  const [expenseCategory, setExpenseCategory] = useState<ExpenseCategory>("Gear & Maintenance");
  const [expenseAmountZAR, setExpenseAmountZAR] = useState<number>(1200);
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split("T")[0]);
  const [expenseDescription, setExpenseDescription] = useState("");
  const [isSubmittingExpense, setIsSubmittingExpense] = useState(false);

  const loadData = async () => {
    try {
      const [allB, allP, allE, allS] = await Promise.all([
        getAllBookings(),
        getPhotographers(),
        getExpenses(),
        getServices()
      ]);
      setBookings(allB || []);
      const sanitizedPhotos = (allP || []).map((p) => {
        if (p.id === "photo-camryn" || p.name.toLowerCase().includes("camryn")) {
          return {
            ...p,
            isLead: true,
            role: p.role && !p.role.toLowerCase().startsWith("photo") ? p.role : "Owner / Photographer"
          };
        }
        if (p.id === "photo-brendon" || p.name.toLowerCase().includes("brendon")) {
          return {
            ...p,
            isLead: false,
            role: p.role && p.role.toLowerCase().includes("associate") ? p.role : "Associate Photographer"
          };
        }
        if (p.id === "photo-miah" || p.name.toLowerCase().includes("miah")) {
          return {
            ...p,
            isLead: false,
            role: p.role && p.role.toLowerCase().includes("associate") ? p.role : "Associate Photographer"
          };
        }
        return p;
      });
      setPhotographers(sanitizedPhotos);
      setExpenses(allE || []);
      setServices(allS || []);
    } catch (err) {
      console.error("Failed to load admin dashboard data", err);
    }
  };

  useEffect(() => {

    let cancelled = false;
    (async () => {
      const user = await fetchCurrentUser();
      if (!cancelled) {
        if (user && user.role === "admin") {
          setAuthUser(user);
        } else {
          router.replace("/login/admin");
        }
      }
    })();
    loadData();
    return () => { cancelled = true; };
  }, [router]);

  // Open Edit Modal
  const handleOpenEdit = (b: Booking) => {
    setEditingBooking(b);
    setEditStatus((b.status as BookingStatus) || "Confirmed");
    setEditPaymentStatus((b.paymentStatus as PaymentStatus) || "Deposit Paid");
    setEditDate(b.date || "");
    setEditTimeSlot(b.timeSlot || "");
    setEditPhotographerId(b.photographerId || "");
    setEditGalleryUrl(b.galleryUrl || "");
    setEditNotes(b.customer?.notes || "");
  };

  // Save Booking Edits
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBooking) return;
    setIsSavingEdit(true);
    const photoMatch = photographers.find((p) => p.id === editPhotographerId);
    await updateBooking(editingBooking.id, {
      status: editStatus,
      paymentStatus: editPaymentStatus,
      date: editDate,
      timeSlot: editTimeSlot,
      photographerId: editPhotographerId || editingBooking.photographerId,
      photographerName: photoMatch ? photoMatch.name : editingBooking.photographerName,
      galleryUrl: editGalleryUrl.trim() || undefined,
      galleryStatus: editGalleryUrl.trim() ? "ready" : undefined,
      customer: {
        ...editingBooking.customer,
        notes: editNotes
      }
    });
    setEditingBooking(null);
    setIsSavingEdit(false);
    loadData();
    setNotification(`Booking ${editingBooking.bookingReference} updated successfully.`);
    setTimeout(() => setNotification(null), 5000);
  };

  // Create Manual Walk-In Booking
  const handleCreateManualBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualClientName || !manualClientEmail) return;
    setIsCreatingManual(true);
    const photoMatch = photographers.find((p) => p.id === manualPhotographerId) || photographers[0];

    const deposit = Math.round(manualPriceZAR * 0.5);
    const newBk = await createBooking({
      clientId: manualClientEmail,
      serviceId: "serv-custom",
      serviceName: manualPackageName.split(" ")[0] || "Custom Session",
      packageId: `pkg_${Date.now()}`,
      packageName: manualPackageName,
      photographerId: photoMatch ? photoMatch.id : "photo-camryn",
      photographerName: photoMatch ? photoMatch.name : "Camryn Burger (Lead)",
      date: manualDate,
      timeSlot: manualTimeSlot,
      customer: {
        fullName: manualClientName,
        email: manualClientEmail,
        phone: manualClientPhone,
        eventType: manualPackageName,
        notes: "Direct Studio Walk-in / Phone Reservation"
      },
      location: {
        venueName: manualVenue,
        address: `${manualVenue}, Gauteng`,
        suburb: "Gauteng",
        latitude: -26.0883,
        longitude: 27.8447,
        distanceFromBaseKm: 15,
        travelFeeZAR: 0
      },
      basePriceZAR: manualPriceZAR,
      travelFeeZAR: 0,
      lateNightSurchargeZAR: 0,
      subtotalZAR: manualPriceZAR,
      depositRequiredZAR: deposit,
      remainingBalanceZAR: manualPriceZAR - deposit
    });

    setIsCreatingManual(false);
    setShowCreateBooking(false);
    setManualClientName("");
    setManualClientEmail("");
    loadData();
    setNotification(`Manual booking ${newBk.bookingReference} logged successfully for ${manualClientName}.`);
    setTimeout(() => setNotification(null), 5000);
  };

  // Permanently Delete Booking
  const handleDeleteBooking = async (id: string, ref: string) => {
    if (confirm(`Permanently delete booking ${ref}? This will remove it from all systems.`)) {
      await deleteBooking(id);
      loadData();
      setNotification(`Booking ${ref} was permanently deleted.`);
      setTimeout(() => setNotification(null), 5000);
    }
  };

  // Photographer Image File Upload (converts to base64 DataURL for offline & instant display)
  const handlePhotoFileUpload = (e: React.ChangeEvent<HTMLInputElement>, mode: "edit" | "add") => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      alert("File size exceeds 8MB. Please choose a smaller photo.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        if (mode === "edit") {
          setEditPhotoAvatarUrl(result);
        } else {
          setNewPhotoAvatarUrl(result);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  // Media / Package / Category Image Upload Handler
  const handleMediaFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    target: "newPkg" | "editPkg" | "newServ" | "editServ"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      alert("File size exceeds 8MB. Please choose a smaller photo.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        if (target === "newPkg") setNewPkgImageUrl(result);
        else if (target === "editPkg") setEditPkgImageUrl(result);
        else if (target === "newServ") setNewServiceImageUrl(result);
        else if (target === "editServ") setEditServiceImageUrl(result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Open Photographer Profile Editor
  const handleOpenEditPhotographer = (p: Photographer) => {
    setEditingPhotographer(p);
    setEditPhotoName(p.name);
    setEditPhotoRole(p.role || (p.isLead ? "Owner / Photographer" : "Photographer"));
    setEditPhotoIsLead(!!p.isLead);
    setEditPhotoEmail(p.email);
    setEditPhotoPhone(p.phone || "+27 ");
    setEditPhotoInstagram(p.instagram || "");
    setEditPhotoBio(p.bio || "");
    setEditPhotoSpecialties(Array.isArray(p.specialties) ? p.specialties.join(", ") : "");
    setEditPhotoRating(p.rating || 5.0);
    setEditPhotoCompletedShoots(p.completedShoots || 0);
    setEditPhotoAvatarUrl(p.avatarUrl || "/backgrounds/camryn-portrait.jpg");
    setEditPhotoAvailableDays(p.availableDays || ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]);
  };

  // Save Photographer Profile Updates
  const handleSavePhotographerEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPhotographer) return;

    setIsSavingPhotographer(true);
    const specialtiesArr = editPhotoSpecialties
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const updatedProfile: Photographer = {
      ...editingPhotographer,
      name: editPhotoName.trim(),
      role: (editPhotoRole.trim() as any) || (editPhotoIsLead ? "Owner / Photographer" : "Photographer"),
      isLead: editPhotoIsLead,
      email: editPhotoEmail.trim(),
      phone: editPhotoPhone.trim(),
      bio: editPhotoBio.trim(),
      instagram: editPhotoInstagram.trim() || undefined,
      specialties: specialtiesArr.length > 0 ? specialtiesArr : ["Weddings", "Portraits"],
      rating: Number(editPhotoRating) || 5.0,
      completedShoots: Number(editPhotoCompletedShoots) || 0,
      avatarUrl: editPhotoAvatarUrl.trim() || "/backgrounds/camryn-portrait.jpg",
      availableDays: editPhotoAvailableDays.length > 0 ? editPhotoAvailableDays : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    };

    try {
      await updatePhotographer(updatedProfile);
      setEditingPhotographer(null);
      loadData();
      setNotification(`Photographer profile for ${editPhotoName} updated successfully.`);
      setTimeout(() => setNotification(null), 5000);
    } catch (err) {
      console.error("Failed to update photographer profile", err);
    } finally {
      setIsSavingPhotographer(false);
    }
  };

  // Add Photographer
  const handleAddPhotographer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoName || !newPhotoEmail) return;

    setIsSubmittingPhoto(true);
    const newId = `photo_${Date.now()}`;
    const specialtiesArr = newPhotoSpecialties.split(",").map((s) => s.trim()).filter(Boolean);

    const newProfile: Photographer = {
      id: newId,
      name: newPhotoName,
      email: newPhotoEmail,
      phone: newPhotoPhone,
      role: (newPhotoRole as any) || "Photographer",
      isLead: false,
      activeShoots: 0,
      bio: newPhotoBio.trim() || `Professional Associate Photographer specializing in ${newPhotoSpecialties}.`,
      instagram: newPhotoInstagram.trim() || undefined,
      specialties: specialtiesArr.length > 0 ? specialtiesArr : ["Weddings", "Portraits"],
      rating: 5.0,
      completedShoots: 0,
      availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      avatarUrl: newPhotoAvatarUrl.trim() || "/backgrounds/miah-portrait.jpg",
      createdAt: new Date().toISOString().split("T")[0]
    };

    try {
      await addPhotographer(newProfile);
      setNotification(`Photographer ${newPhotoName} added to team roster.`);
      setShowAddPhotoModal(false);
      setNewPhotoName("");
      setNewPhotoEmail("");
      setNewPhotoBio("");
      setNewPhotoInstagram("");
      setNewPhotoPhone("+27 ");
      setNewPhotoAvatarUrl("/backgrounds/miah-portrait.jpg");
      loadData();
    } catch (err) {
      console.error("Failed to add photographer", err);
    } finally {
      setIsSubmittingPhoto(false);
      setTimeout(() => setNotification(null), 5000);
    }
  };

  // Delete Photographer
  const handleDeletePhotographer = async (id: string, name: string) => {
    if (confirm(`Remove photographer "${name}" from the studio roster?`)) {
      await deletePhotographer(id);
      loadData();
      setNotification(`Photographer ${name} removed from roster.`);
      setTimeout(() => setNotification(null), 5000);
    }
  };

  // -------------------- PACKAGES & PRICING HANDLERS --------------------

  // Quick Inline Price Save
  const handleQuickPriceSave = async (packageId: string, newPrice: number) => {
    if (isNaN(newPrice) || newPrice < 0) return;
    try {
      await updatePackagePrice(packageId, newPrice);
      loadData();
      setNotification(`Package price successfully adjusted to R ${formatCurrency(newPrice)}.`);
      setTimeout(() => setNotification(null), 5000);
    } catch (err) {
      console.error("Failed to update package price", err);
    }
  };

  // Toggle "Most Popular" on a package
  const handleTogglePopular = async (serviceId: string, pkg: PackageOption) => {
    try {
      const updated: PackageOption = { ...pkg, popular: !pkg.popular };
      await updatePackage(serviceId, updated);
      loadData();
      setNotification(
        `Package "${pkg.name}" is now ${updated.popular ? "marked as Most Popular" : "unmarked"}.`
      );
      setTimeout(() => setNotification(null), 4000);
    } catch (err) {
      console.error("Failed to toggle popular status", err);
    }
  };

  // Open Edit Package Modal
  const handleOpenEditPackage = (serviceId: string, pkg: PackageOption) => {
    setEditingPackage({ serviceId, package: pkg });
    setEditPkgName(pkg.name);
    setEditPkgTagline(pkg.tagline || "");
    setEditPkgPrice(pkg.startingPriceZAR);
    setEditPkgDuration(pkg.durationHours);
    setEditPkgImages(pkg.editedImagesCount);
    setEditPkgFeatures(pkg.features ? pkg.features.join("\n") : "");
    setEditPkgPopular(!!pkg.popular);
    setEditPkgImageUrl(pkg.imageUrl || "");
  };

  // Save Package Changes
  const handleSaveEditPackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPackage || !editPkgName) return;

    setIsSavingPackageEdit(true);
    const featuresArr = editPkgFeatures
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    const updated: PackageOption = {
      ...editingPackage.package,
      name: editPkgName.trim(),
      tagline: editPkgTagline.trim(),
      startingPriceZAR: Number(editPkgPrice) || 0,
      durationHours: Number(editPkgDuration) || 1,
      editedImagesCount: Number(editPkgImages) || 1,
      features: featuresArr.length > 0 ? featuresArr : [editPkgTagline.trim()],
      popular: editPkgPopular,
      imageUrl: editPkgImageUrl.trim() || undefined
    };

    try {
      await updatePackage(editingPackage.serviceId, updated);
      setEditingPackage(null);
      loadData();
      setNotification(`Package "${editPkgName}" was updated successfully.`);
      setTimeout(() => setNotification(null), 5000);
    } catch (err) {
      console.error("Failed to save package edit", err);
    } finally {
      setIsSavingPackageEdit(false);
    }
  };

  // Add New Package
  const handleAddPackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPkgServiceId || !newPkgName) return;

    setIsSubmittingPackage(true);
    const featuresArr = newPkgFeatures
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    try {
      await addPackage(newPkgServiceId, {
        name: newPkgName.trim(),
        tagline: newPkgTagline.trim() || `${newPkgImages} edited photos, ${newPkgDuration} hours`,
        startingPriceZAR: Number(newPkgPrice) || 2000,
        durationHours: Number(newPkgDuration) || 2,
        editedImagesCount: Number(newPkgImages) || 40,
        features: featuresArr.length > 0 ? featuresArr : [newPkgTagline.trim() || "Dedicated professional shoot"],
        popular: newPkgPopular,
        imageUrl: newPkgImageUrl.trim() || undefined
      });

      setShowAddPackageModal(false);
      setNewPkgName("");
      setNewPkgTagline("");
      setNewPkgPrice(2500);
      setNewPkgDuration(2);
      setNewPkgImages(50);
      setNewPkgFeatures("");
      setNewPkgPopular(false);
      setNewPkgImageUrl("");
      loadData();
      setNotification(`New package "${newPkgName}" created and published successfully.`);
      setTimeout(() => setNotification(null), 5000);
    } catch (err) {
      console.error("Failed to add new package", err);
    } finally {
      setIsSubmittingPackage(false);
    }
  };

  // Create New Service Category
  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceTitle.trim()) return;
    setIsSubmittingService(true);
    const slug = newServiceTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const serviceId = `serv-${slug || Date.now()}`;
    const initialPkg: PackageOption = {
      id: `pkg-${slug}-1`,
      serviceId,
      name: newServiceTierName.trim() || "Standard Package",
      tagline: `${newServiceTierImages} edited images, ${newServiceTierDuration} hours`,
      durationHours: Number(newServiceTierDuration) || 1.5,
      editedImagesCount: Number(newServiceTierImages) || 40,
      startingPriceZAR: Number(newServiceTierPrice) || 2500,
      features: [
        `${newServiceTierDuration} Hours photography coverage`,
        `${newServiceTierImages} Hand-crafted high-resolution edited images`,
        "Private digital delivery gallery",
        "Online print ordering store"
      ],
      popular: true,
      imageUrl: newServiceImageUrl
    };

    const newServiceObj: Service = {
      id: serviceId,
      slug: slug as any,
      title: newServiceTitle.trim(),
      tagline: newServiceTagline.trim() || `Bespoke ${newServiceTitle} photography sessions.`,
      description: newServiceDescription.trim() || `Professional ${newServiceTitle} coverage tailored to you.`,
      longDescription: newServiceDescription.trim() || `Fine-art editorial coverage for ${newServiceTitle}.`,
      imageUrl: newServiceImageUrl.trim() || "/backgrounds/demo-wedding.jpg",
      startingPriceZAR: Number(newServiceTierPrice) || 2500,
      approxDuration: `${newServiceTierDuration} Hours`,
      editedImagesSummary: `${newServiceTierImages} Edited Images`,
      inclusions: [
        "Professional photographic lighting & equipment",
        "Private online proofing gallery",
        "Color graded digital delivery"
      ],
      packages: [initialPkg]
    };

    try {
      await createService(newServiceObj);
      setShowAddServiceModal(false);
      setNewServiceTitle("");
      setNewServiceTagline("");
      setNewServiceDescription("");
      loadData();
      setNotification(`New service category "${newServiceTitle}" created successfully!`);
      setTimeout(() => setNotification(null), 5000);
    } catch (err) {
      console.error("Failed to create new service", err);
    } finally {
      setIsSubmittingService(false);
    }
  };

  // Open Edit Service Category
  const handleOpenEditService = (service: Service) => {
    setEditingService(service);
    setEditServiceTitle(service.title);
    setEditServiceTagline(service.tagline || "");
    setEditServiceDescription(service.description || "");
    setEditServiceImageUrl(service.imageUrl || "/backgrounds/demo-wedding.jpg");
  };

  // Save Service Category Edits
  const handleSaveServiceEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    setIsSavingServiceEdit(true);
    const updated: Service = {
      ...editingService,
      title: editServiceTitle.trim(),
      tagline: editServiceTagline.trim(),
      description: editServiceDescription.trim(),
      imageUrl: editServiceImageUrl.trim() || editingService.imageUrl
    };
    try {
      await updateService(updated);
      setEditingService(null);
      loadData();
      setNotification(`Service category "${editServiceTitle}" updated successfully.`);
      setTimeout(() => setNotification(null), 5000);
    } catch (err) {
      console.error("Failed to save service edit", err);
    } finally {
      setIsSavingServiceEdit(false);
    }
  };

  // Delete Package
  const handleDeletePackage = async (serviceId: string, pkgId: string, pkgName: string) => {
    if (confirm(`Are you sure you want to permanently delete package "${pkgName}"?`)) {
      try {
        await deletePackage(serviceId, pkgId);
        loadData();
        setNotification(`Package "${pkgName}" was deleted.`);
        setTimeout(() => setNotification(null), 5000);
      } catch (err) {
        console.error("Failed to delete package", err);
      }
    }
  };

  // Reset Pricing to Studio Factory Defaults

  // Add Expense
  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseTitle || expenseAmountZAR <= 0) return;

    setIsSubmittingExpense(true);
    try {
      await addExpense({
        title: expenseTitle,
        category: expenseCategory,
        amountZAR: expenseAmountZAR,
        date: expenseDate,
        description: expenseDescription,
        loggedBy: authUser?.name || "Studio Admin"
      });

      setNotification(`Expense "${expenseTitle}" of R ${formatCurrency(expenseAmountZAR)} logged successfully.`);
      setShowAddExpenseModal(false);
      setExpenseTitle("");
      setExpenseDescription("");
      setExpenseAmountZAR(1200);
      loadData();
    } catch (err) {
      console.error("Failed to log expense", err);
    } finally {
      setIsSubmittingExpense(false);
      setTimeout(() => setNotification(null), 5000);
    }
  };

  // Delete Expense
  const handleDeleteExpense = async (id: string, title: string) => {
    if (confirm(`Delete expense record "${title}"?`)) {
      await deleteExpense(id);
      loadData();
      setNotification(`Expense "${title}" deleted.`);
      setTimeout(() => setNotification(null), 5000);
    }
  };

  // Financial Metrics
  const grossRevenueZAR = bookings
    .filter((b) => b.status !== "Cancelled")
    .reduce((sum, b) => sum + (b.subtotalZAR || 0), 0);

  const totalExpensesZAR = expenses.reduce((sum, e) => sum + (e.amountZAR || 0), 0);
  const netProfitZAR = grossRevenueZAR - totalExpensesZAR;
  const operatingMargin = grossRevenueZAR > 0 ? ((netProfitZAR / grossRevenueZAR) * 100).toFixed(1) : "0.0";
  const activeBookingsCount = bookings.filter((b) => b.status === "Confirmed" || b.status === "Pending").length;
  const outstandingBalancesZAR = bookings
    .filter((b) => b.paymentStatus !== "Paid in Full" && b.status !== "Cancelled")
    .reduce((sum, b) => sum + (b.remainingBalanceZAR || 0), 0);

  // Catalog Packages calculation
  const allPackages = services.flatMap((s) =>
    (s.packages || []).map((p) => ({
      ...p,
      serviceTitle: s.title,
      serviceSlug: s.slug
    }))
  );

  const filteredServices = services
    .filter(
      (s) =>
        packageFilterService === "all" ||
        s.id === packageFilterService ||
        s.slug === packageFilterService
    )
    .map((s) => {
      if (!packageSearch.trim()) return s;
      const q = packageSearch.toLowerCase();
      const filteredPkgs = (s.packages || []).filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          (p.features && p.features.some((f) => f.toLowerCase().includes(q))) ||
          s.title.toLowerCase().includes(q)
      );
      return { ...s, packages: filteredPkgs };
    })
    .filter((s) => s.packages && s.packages.length > 0);

  // Filtered Bookings List
  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = statusFilter === "All" || b.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      b.bookingReference.toLowerCase().includes(q) ||
      b.customer.fullName.toLowerCase().includes(q) ||
      b.customer.email.toLowerCase().includes(q) ||
      b.packageName.toLowerCase().includes(q) ||
      b.location.venueName.toLowerCase().includes(q) ||
      b.photographerName.toLowerCase().includes(q);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] dark:bg-[#141210] text-[#2C2420] dark:text-[#FAF8F5] transition-colors duration-300">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 sm:py-32 w-full space-y-8">
        {/* Header Console */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE3D9] dark:border-[#3A332C] pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-semibold">
                Studio Executive Console
              </span>
              <span className="bg-[#2E5E43]/15 text-[#2E5E43] dark:text-emerald-400 text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                Full Admin Control Active
              </span>
            </div>
            <h1 className="font-serif-heading text-3xl sm:text-4xl font-normal mt-0.5">
              Operations, Financials & Studio Team
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Welcome, {authUser?.name || "Studio Admin"}. Manage bookings, expenses, team photographers & Gauteng operations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/photographer/dashboard"
              className="px-3 py-2 bg-[#FAF8F5] dark:bg-[#25221F] border border-[#EAE3D9] dark:border-[#3A332C] hover:border-[#C5A880] text-[#2C2420] dark:text-[#FAF8F5] text-xs font-medium rounded-sm flex items-center gap-1.5 transition-colors"
              title="Open Photographer Portal to view shoot execution and assignments"
            >
              <Camera className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Photographer Portal</span>
            </Link>

            <Link
              href="/client/dashboard"
              className="px-3 py-2 bg-[#FAF8F5] dark:bg-[#25221F] border border-[#EAE3D9] dark:border-[#3A332C] hover:border-[#C5A880] text-[#2C2420] dark:text-[#FAF8F5] text-xs font-medium rounded-sm flex items-center gap-1.5 transition-colors"
              title="Preview Client Portal"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Client Portal</span>
            </Link>

            <button
              type="button"
              onClick={async () => {
                await logoutUser();
                router.push("/login/admin");
              }}
              className="px-3 py-2 bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium rounded-sm flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Sign Out of Admin Portal"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-500" />
              <span>Sign Out</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (services.length > 0 && !newPkgServiceId) {
                  setNewPkgServiceId(services[0].id);
                }
                setActiveTab("packages");
                setShowAddPackageModal(true);
              }}
              className="bg-[#2C2420] dark:bg-[#C5A880] text-white dark:text-[#2C2420] hover:bg-[#C5A880] hover:text-[#2C2420] text-xs font-semibold uppercase tracking-wider py-2.5 px-4 rounded-sm flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
            >
              <Package className="w-4 h-4" />
              <span>+ Add Package</span>
            </button>
            <button
              type="button"
              onClick={() => setShowCreateBooking(true)}
              className="bg-[#C5A880] text-[#2C2420] hover:bg-[#2C2420] hover:text-white dark:hover:bg-[#FAF8F5] text-xs font-semibold uppercase tracking-wider py-2.5 px-4 rounded-sm flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
            >
              <FilePlus className="w-4 h-4" />
              <span>+ Manual Booking</span>
            </button>
            <button
              type="button"
              onClick={() => setShowAddExpenseModal(true)}
              className="bg-[#2E5E43] text-white hover:bg-emerald-800 text-xs font-semibold uppercase tracking-wider py-2.5 px-4 rounded-sm flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
            >
              <Receipt className="w-4 h-4" />
              <span>+ Log Expense</span>
            </button>
            <button
              type="button"
              onClick={() => setShowAddPhotoModal(true)}
              className="bg-[#2C2420] dark:bg-[#C5A880] text-white dark:text-[#2C2420] hover:bg-[#C5A880] text-xs font-semibold uppercase tracking-wider py-2.5 px-4 rounded-sm flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Photographer</span>
            </button>
          </div>
        </div>

        {/* Notification Toast */}
        {notification && (
          <div className="p-4 bg-[#2E5E43]/15 border border-[#2E5E43]/30 text-[#2E5E43] dark:text-emerald-300 text-xs rounded-sm flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{notification}</span>
          </div>
        )}

        {/* 4 Financial & Operational Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* 1. Confirmed Gross Revenue */}
          <div className="bg-white dark:bg-[#1C1917] border border-[#EAE3D9] dark:border-[#3A332C] rounded-sm p-5 space-y-2 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-400">
                Gross Confirmed Revenue
              </span>
              <DollarSign className="w-4 h-4 text-[#C5A880]" />
            </div>
            <div className="text-2xl sm:text-3xl font-serif-heading font-semibold text-[#2C2420] dark:text-[#FAF8F5]">
              R {formatCurrency(grossRevenueZAR)}
            </div>
            <p className="text-[11px] text-neutral-500">
              Outstanding: R {formatCurrency(outstandingBalancesZAR)}
            </p>
          </div>

          {/* 2. Studio Operating Expenses */}
          <div className="bg-white dark:bg-[#1C1917] border border-[#EAE3D9] dark:border-[#3A332C] rounded-sm p-5 space-y-2 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-400">
                Operating Expenses
              </span>
              <Receipt className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-serif-heading font-semibold text-rose-600 dark:text-rose-400">
              -R {formatCurrency(totalExpensesZAR)}
            </div>
            <p className="text-[11px] text-neutral-500">
              {expenses.length} expense items recorded
            </p>
          </div>

          {/* 3. Net Studio Profit */}
          <div className="bg-white dark:bg-[#1C1917] border border-[#EAE3D9] dark:border-[#3A332C] rounded-sm p-5 space-y-2 shadow-sm ring-1 ring-[#2E5E43]/30">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-400">
                Net Studio Profit
              </span>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-serif-heading font-semibold text-[#2E5E43] dark:text-emerald-400">
              R {formatCurrency(netProfitZAR)}
            </div>
            <p className="text-[11px] text-[#2E5E43] dark:text-emerald-400 font-semibold">
              {operatingMargin}% Net Operating Margin
            </p>
          </div>

          {/* 4. Active Shoots & Team */}
          <div className="bg-white dark:bg-[#1C1917] border border-[#EAE3D9] dark:border-[#3A332C] rounded-sm p-5 space-y-2 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-400">
                Active Bookings & Roster
              </span>
              <Calendar className="w-4 h-4 text-[#C5A880]" />
            </div>
            <div className="text-2xl sm:text-3xl font-serif-heading font-semibold text-[#2C2420] dark:text-[#FAF8F5]">
              {activeBookingsCount} Shoots
            </div>
            <p className="text-[11px] text-neutral-500">
              {photographers.length} Photographers on team
            </p>
          </div>
        </div>

        {/* Tab Navigation for Admin Sections */}
        <div className="flex border-b border-[#EAE3D9] dark:border-[#3A332C] space-x-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "overview"
                ? "border-[#C5A880] text-[#C5A880]"
                : "border-transparent text-neutral-400 hover:text-neutral-600"
            }`}
          >
            All Bookings ({bookings.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("packages")}
            className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "packages"
                ? "border-[#C5A880] text-[#C5A880]"
                : "border-transparent text-neutral-400 hover:text-neutral-600"
            }`}
          >
            Packages & Pricing ({allPackages.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("financials")}
            className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "financials"
                ? "border-[#C5A880] text-[#C5A880]"
                : "border-transparent text-neutral-400 hover:text-neutral-600"
            }`}
          >
            Financials & Expenses ({expenses.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("team")}
            className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "team"
                ? "border-[#C5A880] text-[#C5A880]"
                : "border-transparent text-neutral-400 hover:text-neutral-600"
            }`}
          >
            Photographers Roster ({photographers.length})
          </button>
        </div>

        {/* ================= TAB 1: ALL CLIENT BOOKINGS ================= */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            {/* Search & Status Filter Toolbar */}
            <div className="bg-white dark:bg-[#1C1917] border border-[#EAE3D9] dark:border-[#3A332C] rounded-sm p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search bookings by client name, reference, package or venue..."
                  className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] pl-9 pr-3 py-2 rounded text-xs focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              {/* Status Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                {["All", "Confirmed", "Pending", "Completed", "Cancelled"].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-sm text-xs font-semibold transition-all cursor-pointer ${
                      statusFilter === st
                        ? "bg-[#C5A880] text-[#2C2420] shadow-sm font-bold"
                        : "bg-[#FAF8F5] dark:bg-[#141210] text-neutral-500 border border-[#EAE3D9] dark:border-[#3A332C] hover:border-[#C5A880]"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Complete Client Bookings Table */}
            <div className="bg-white dark:bg-[#1C1917] border border-[#EAE3D9] dark:border-[#3A332C] rounded-sm overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F5] dark:bg-[#141210] border-b border-[#EAE3D9] dark:border-[#3A332C] uppercase text-[10px] tracking-wider text-neutral-400">
                    <tr>
                      <th className="p-3">Ref</th>
                      <th className="p-3">Client</th>
                      <th className="p-3">Package</th>
                      <th className="p-3">Date & Slot</th>
                      <th className="p-3">Photographer</th>
                      <th className="p-3">Venue</th>
                      <th className="p-3">Subtotal (ZAR)</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE3D9] dark:divide-[#3A332C]">
                    {filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/40">
                        <td className="p-3 font-mono font-bold text-[#C5A880]">{b.bookingReference}</td>
                        <td className="p-3 font-medium">
                          {b.customer.fullName}
                          <span className="block text-[11px] text-neutral-400">{b.customer.phone}</span>
                        </td>
                        <td className="p-3">{b.packageName}</td>
                        <td className="p-3">
                          {b.date}
                          <span className="block text-[11px] text-neutral-400">{b.timeSlot}</span>
                        </td>
                        <td className="p-3">{b.photographerName}</td>
                        <td className="p-3">
                          {b.location.venueName}
                          <span className="block text-[11px] text-neutral-400">{b.location.distanceFromBaseKm} km</span>
                        </td>
                        <td className="p-3 font-semibold">R {formatCurrency(b.subtotalZAR)}</td>
                        <td className="p-3">
                          <div className="space-y-1">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded inline-block ${
                                b.status === "Confirmed"
                                  ? "bg-[#2E5E43]/15 text-[#2E5E43] dark:text-emerald-400"
                                  : b.status === "Cancelled"
                                  ? "bg-rose-500/15 text-rose-600"
                                  : "bg-amber-500/15 text-amber-700"
                              }`}
                            >
                              {b.status}
                            </span>
                            <span className="block text-[10px] text-neutral-400 font-medium">
                              {b.paymentStatus}
                            </span>
                            {b.yocoCheckoutId && (
                              <span className="text-[9px] font-mono text-[#C5A880] block truncate max-w-[120px]" title={b.yocoCheckoutId}>
                                Yoco: {b.yocoCheckoutId.slice(0, 12)}...
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-3 text-right space-x-2 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(b)}
                            className="inline-flex items-center gap-1 text-[#C5A880] hover:text-[#2C2420] dark:hover:text-white text-xs font-semibold p-1 hover:underline cursor-pointer"
                            title="Edit Booking Details"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteBooking(b.id, b.bookingReference)}
                            className="inline-flex items-center gap-1 text-rose-500 hover:text-rose-700 text-xs font-semibold p-1 hover:underline cursor-pointer"
                            title="Permanently Delete Booking"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredBookings.length === 0 && (
                      <tr>
                        <td colSpan={9} className="p-8 text-center text-neutral-400">
                          No bookings matching &quot;{searchQuery}&quot; found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: FINANCIALS & EXPENSES ================= */}
        {activeTab === "financials" && (
          <div className="space-y-6">
            {/* Yoco Payment Gateway Status & Configuration Card */}
            <div className="bg-gradient-to-r from-[#2C2420] to-[#1C1917] text-[#FAF8F5] border border-[#C5A880]/30 rounded-sm p-6 shadow-md space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#C5A880]/20 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#2E5E43]/30 text-emerald-400 flex items-center justify-center ring-2 ring-emerald-500/20">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif-heading text-lg font-semibold">
                        Yoco Payment Gateway Integration
                      </h4>
                      <span className="bg-emerald-500/20 text-emerald-300 text-[9px] font-bold px-2 py-0.5 rounded uppercase flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Active • Production Gateway
                      </span>
                    </div>
                    <p className="text-xs text-[#EAE3D9]/75">
                      Fully integrated server-side Hosted Checkout, 3D-Secure 2.0 Card Processing & Webhook Reconciliation
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText("pk_test_30c973e3kwJzYKA0c174");
                      setNotification("Yoco Public Key copied to clipboard!");
                      setTimeout(() => setNotification(null), 3000);
                    }}
                    className="border border-[#C5A880]/40 text-[#C5A880] hover:bg-[#C5A880]/10 text-xs font-semibold px-3 py-1.5 rounded transition-colors cursor-pointer"
                  >
                    Copy Public Key
                  </button>
                  <a
                    href="https://portal.yoco.co.za"
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#C5A880] text-[#2C2420] hover:bg-[#FAF8F5] text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-1 transition-colors"
                  >
                    <span>Yoco Business Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="bg-white/5 border border-white/10 rounded p-3 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-neutral-400">Public API Key:</span>
                  <div className="font-mono text-[11px] text-[#C5A880] truncate">
                    pk_test_30c973e3kwJzYKA0c174
                  </div>
                  <span className="text-[10px] text-neutral-400">Client-safe SDK token</span>
                </div>

                <div className="bg-white/5 border border-white/10 rounded p-3 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-neutral-400">Secret API Key:</span>
                  <div className="font-mono text-[11px] text-emerald-400 truncate">
                    sk_test_••••••••••••19d2
                  </div>
                  <span className="text-[10px] text-neutral-400">Server-side authenticated</span>
                </div>

                <div className="bg-white/5 border border-white/10 rounded p-3 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-neutral-400">Supported Methods:</span>
                  <div className="text-[11px] text-[#FAF8F5] font-medium">
                    Visa, Mastercard, Instant EFT, Apple Pay
                  </div>
                  <span className="text-[10px] text-neutral-400">South African Rand (ZAR)</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1C1917] border border-[#EAE3D9] dark:border-[#3A332C] rounded-sm p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EAE3D9] dark:border-[#3A332C] pb-4">
                <div>
                  <h3 className="font-serif-heading text-xl font-normal">Studio Profit & Loss Breakdown</h3>
                  <p className="text-xs text-neutral-500">
                    Track all equipment repairs, cloud storage, venue fuel and advertising expenses
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddExpenseModal(true)}
                  className="bg-[#2E5E43] text-white hover:bg-emerald-800 text-xs font-semibold uppercase tracking-wider py-2 px-4 rounded-sm flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Log New Expense</span>
                </button>
              </div>

              {/* Expense Items Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F5] dark:bg-[#141210] border-b border-[#EAE3D9] dark:border-[#3A332C] uppercase text-[10px] tracking-wider text-neutral-400">
                    <tr>
                      <th className="p-3">Expense Item</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Logged By</th>
                      <th className="p-3">Amount (ZAR)</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE3D9] dark:divide-[#3A332C]">
                    {expenses.map((exp) => (
                      <tr key={exp.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/40">
                        <td className="p-3">
                          <strong className="block text-[#2C2420] dark:text-[#FAF8F5]">{exp.title}</strong>
                          {exp.description && <span className="text-[11px] text-neutral-400">{exp.description}</span>}
                        </td>
                        <td className="p-3">
                          <span className="bg-[#C5A880]/15 text-[#C5A880] text-[10px] font-bold px-2 py-0.5 rounded">
                            {exp.category}
                          </span>
                        </td>
                        <td className="p-3 text-neutral-500">{exp.date}</td>
                        <td className="p-3 text-neutral-400">{exp.loggedBy || "Admin"}</td>
                        <td className="p-3 font-semibold text-rose-600 dark:text-rose-400">
                          -R {formatCurrency(exp.amountZAR)}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteExpense(exp.id, exp.title)}
                            className="text-rose-500 hover:text-rose-700 p-1 hover:underline cursor-pointer"
                            title="Delete Expense Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {expenses.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-neutral-400">
                          No operating expenses recorded yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: PACKAGES & PRICING ================= */}
        {activeTab === "packages" && (
          <div className="space-y-6 animate-fade-in">
            {/* Header & Catalog Summary */}
            <div className="bg-white dark:bg-[#1C1917] border border-[#EAE3D9] dark:border-[#3A332C] rounded-sm p-6 shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EAE3D9] dark:border-[#3A332C] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-widest text-[#C5A880] font-bold">Studio Catalog</span>
                    <span className="bg-[#C5A880]/20 text-[#C5A880] text-[10px] font-bold px-2 py-0.5 rounded">
                      {allPackages.length} Total Packages
                    </span>
                  </div>
                  <h3 className="font-serif-heading text-2xl font-normal text-[#2C2420] dark:text-[#FAF8F5]">
                    Packages & Pricing Management
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Adjust rates instantly, manage deliverables, or create new packages across all photography categories.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowAddServiceModal(true)}
                    className="border border-[#C5A880] text-[#C5A880] hover:bg-[#C5A880] hover:text-[#2C2420] text-xs font-semibold uppercase tracking-wider py-2 px-3.5 rounded-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Create a brand new photography category offering (e.g. Maternity, Boudoir, Pets)"
                  >
                    <FolderPlus className="w-4 h-4" />
                    <span>+ New Category</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (services.length > 0 && !newPkgServiceId) {
                        setNewPkgServiceId(services[0].id);
                        setNewPkgImageUrl(services[0].imageUrl || "");
                      }
                      setShowAddPackageModal(true);
                    }}
                    className="bg-[#2C2420] dark:bg-[#C5A880] text-white dark:text-[#2C2420] hover:bg-[#C5A880] hover:text-[#2C2420] text-xs font-semibold uppercase tracking-wider py-2 px-4 rounded-sm flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add Package Tier</span>
                  </button>
                </div>
              </div>

              {/* Filter and Search Bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
                  <input
                    type="text"
                    value={packageSearch}
                    onChange={(e) => setPackageSearch(e.target.value)}
                    placeholder="Search packages by name, deliverables, or features..."
                    className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] pl-9 pr-3 py-2 rounded text-xs focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                {/* Category Filter Pills */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPackageFilterService("all")}
                    className={`px-3 py-1.5 rounded-sm text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                      packageFilterService === "all"
                        ? "bg-[#2C2420] dark:bg-[#C5A880] text-white dark:text-[#2C2420]"
                        : "bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] text-neutral-600 dark:text-neutral-400 hover:border-[#C5A880]"
                    }`}
                  >
                    All ({allPackages.length})
                  </button>
                  {services.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setPackageFilterService(s.id)}
                      className={`px-3 py-1.5 rounded-sm text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                        packageFilterService === s.id
                          ? "bg-[#2C2420] dark:bg-[#C5A880] text-white dark:text-[#2C2420]"
                          : "bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] text-neutral-600 dark:text-neutral-400 hover:border-[#C5A880]"
                      }`}
                    >
                      {s.title.split(" ")[0]} ({s.packages?.length || 0})
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Services & Packages List */}
            <div className="space-y-8">
              {filteredServices.map((service) => (
                <div
                  key={service.id}
                  className="bg-white dark:bg-[#1C1917] border border-[#EAE3D9] dark:border-[#3A332C] rounded-sm p-6 shadow-sm space-y-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EAE3D9] dark:border-[#3A332C] pb-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-sm overflow-hidden border border-[#C5A880]/40 shrink-0">
                        <Image
                          src={service.imageUrl}
                          alt={service.title}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif-heading text-lg font-bold text-[#2C2420] dark:text-[#FAF8F5]">
                            {service.title}
                          </h4>
                          <span className="text-[10px] bg-[#C5A880]/15 text-[#C5A880] font-semibold px-2 py-0.5 rounded">
                            {service.packages?.length || 0} Tier{service.packages?.length === 1 ? "" : "s"}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500">
                          Starting at R {formatCurrency(service.startingPriceZAR)} • {service.approxDuration}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <button
                        type="button"
                        onClick={() => handleOpenEditService(service)}
                        className="text-xs font-semibold text-neutral-500 hover:text-[#C5A880] flex items-center gap-1 cursor-pointer py-1 px-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        title="Edit category cover photo & title"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit Category & Photo</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setNewPkgServiceId(service.id);
                          setNewPkgImageUrl(service.imageUrl || "");
                          setShowAddPackageModal(true);
                        }}
                        className="text-xs font-semibold text-[#C5A880] hover:text-[#2C2420] dark:hover:text-white flex items-center gap-1 cursor-pointer py-1 px-2.5 rounded bg-[#C5A880]/15 hover:bg-[#C5A880] transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Package Tier</span>
                      </button>
                    </div>
                  </div>

                  {/* Packages Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {service.packages?.map((pkg) => (
                      <div
                        key={pkg.id}
                        className={`p-5 rounded-sm border flex flex-col justify-between space-y-4 transition-all ${
                          pkg.popular
                            ? "bg-[#FAF8F5] dark:bg-[#141210] border-[#C5A880] ring-1 ring-[#C5A880]/30 shadow-sm"
                            : "bg-white dark:bg-[#1C1917] border-[#EAE3D9] dark:border-[#3A332C]"
                        }`}
                      >
                        <div className="space-y-3">
                          {/* Package Photo Preview */}
                          {(pkg.imageUrl || service.imageUrl) && (
                            <div className="relative h-28 w-full rounded-sm overflow-hidden border border-[#EAE3D9] dark:border-[#3A332C] bg-[#C5A880]/10">
                              <Image
                                src={pkg.imageUrl || service.imageUrl}
                                alt={pkg.name}
                                fill
                                sizes="280px"
                                unoptimized={pkg.imageUrl?.startsWith("data:") || pkg.imageUrl?.startsWith("http")}
                                className="object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2">
                                <span className="text-[10px] text-white/90 font-medium">
                                  {pkg.durationHours}h Session • {pkg.editedImagesCount} Edited Images
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Header with Title and Popular Badge */}
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h5 className="font-serif-heading text-lg font-bold text-[#2C2420] dark:text-[#FAF8F5]">
                                {pkg.name}
                              </h5>
                              <p className="text-xs text-neutral-500 line-clamp-1">{pkg.tagline}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleTogglePopular(service.id, pkg)}
                              className={`text-[9px] uppercase px-2 py-0.5 rounded font-bold cursor-pointer transition-colors shrink-0 ${
                                pkg.popular
                                  ? "bg-[#C5A880] text-[#2C2420] hover:bg-[#b0926d]"
                                  : "bg-neutral-200 dark:bg-neutral-800 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                              }`}
                              title="Click to toggle Most Popular badge"
                            >
                              {pkg.popular ? "★ Most Popular" : "+ Mark Popular"}
                            </button>
                          </div>

                          {/* Price Adjuster Box */}
                          <div className="p-3 bg-[#FAF8F5] dark:bg-[#141210] rounded-sm border border-[#EAE3D9] dark:border-[#3A332C] space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500">
                                Package Price
                              </span>
                              {inlinePricePkgId !== pkg.id && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setInlinePricePkgId(pkg.id);
                                    setInlinePriceValue(pkg.startingPriceZAR);
                                  }}
                                  className="text-[11px] text-[#C5A880] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                                >
                                  <Edit2 className="w-3 h-3" />
                                  <span>Adjust Price</span>
                                </button>
                              )}
                            </div>

                            {inlinePricePkgId === pkg.id ? (
                              <div className="space-y-2 animate-fade-in">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-neutral-400">R</span>
                                  <input
                                    type="number"
                                    min={0}
                                    step={50}
                                    value={inlinePriceValue}
                                    onChange={(e) => setInlinePriceValue(Number(e.target.value))}
                                    className="w-full bg-white dark:bg-[#1C1917] border border-[#C5A880] p-1.5 rounded text-sm font-bold text-[#2C2420] dark:text-[#FAF8F5] focus:outline-none"
                                    autoFocus
                                  />
                                </div>
                                <div className="flex items-center gap-1 flex-wrap">
                                  {[-500, -200, +200, +500].map((delta) => (
                                    <button
                                      key={delta}
                                      type="button"
                                      onClick={() => setInlinePriceValue((prev) => Math.max(0, Number(prev) + delta))}
                                      className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 hover:bg-[#C5A880] hover:text-[#2C2420] transition-colors cursor-pointer"
                                    >
                                      {delta > 0 ? `+${delta}` : delta}
                                    </button>
                                  ))}
                                </div>
                                <div className="flex items-center justify-end gap-1.5 pt-1">
                                  <button
                                    type="button"
                                    onClick={() => setInlinePricePkgId(null)}
                                    className="text-[11px] px-2 py-1 text-neutral-500 hover:text-neutral-700 cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    onClick={async () => {
                                      await handleQuickPriceSave(pkg.id, Number(inlinePriceValue));
                                      setInlinePricePkgId(null);
                                    }}
                                    className="text-[11px] px-3 py-1 bg-[#2C2420] dark:bg-[#C5A880] text-white dark:text-[#2C2420] font-semibold rounded hover:bg-[#C5A880] shadow-sm cursor-pointer"
                                  >
                                    Save Price
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="text-2xl font-serif-heading font-semibold text-[#2C2420] dark:text-[#FAF8F5]">
                                R {formatCurrency(pkg.startingPriceZAR)}
                              </div>
                            )}
                          </div>

                          {/* Shoot Duration & Deliverables Specs */}
                          <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-600 dark:text-neutral-400">
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-[#C5A880]" />
                              <span>{pkg.durationHours} Hours Shoot</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Camera className="w-3.5 h-3.5 text-[#C5A880]" />
                              <span>{pkg.editedImagesCount} Edited Photos</span>
                            </div>
                          </div>

                          {/* Features List */}
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase font-bold text-neutral-400">Features:</span>
                            <ul className="text-xs space-y-1 text-neutral-600 dark:text-neutral-300">
                              {pkg.features?.map((feat, idx) => (
                                <li key={idx} className="flex items-start gap-1.5">
                                  <Check className="w-3.5 h-3.5 text-[#C5A880] shrink-0 mt-0.5" />
                                  <span>{feat}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Package Actions */}
                        <div className="pt-3 border-t border-[#EAE3D9] dark:border-[#3A332C] flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEditPackage(service.id, pkg)}
                            className="text-xs font-semibold text-[#2C2420] dark:text-[#FAF8F5] hover:text-[#C5A880] flex items-center gap-1 cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit Package</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeletePackage(service.id, pkg.id, pkg.name)}
                            className="text-xs font-semibold text-rose-500 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {filteredServices.length === 0 && (
                <div className="p-12 text-center bg-white dark:bg-[#1C1917] border border-[#EAE3D9] dark:border-[#3A332C] rounded-sm space-y-3">
                  <Package className="w-8 h-8 text-neutral-400 mx-auto" />
                  <p className="text-neutral-500 text-sm">No photography packages matched your search or category filter.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setPackageSearch("");
                      setPackageFilterService("all");
                    }}
                    className="text-xs text-[#C5A880] font-semibold hover:underline cursor-pointer"
                  >
                    Clear Search Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 4: PHOTOGRAPHERS ROSTER ================= */}
        {activeTab === "team" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#1C1917] border border-[#EAE3D9] dark:border-[#3A332C] rounded-sm p-6 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EAE3D9] dark:border-[#3A332C] pb-4">
                <div>
                  <h3 className="font-serif-heading text-xl font-normal">Active Studio Photographers & Admin Roster</h3>
                  <p className="text-xs text-neutral-500">
                    Lead, admin, and associate photographers available for calendar assignments. Click "Edit Profile & Photo" to update biography, specialties, or profile pictures.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowAddPhotoModal(true)}
                    className="bg-[#2C2420] dark:bg-[#C5A880] text-white dark:text-[#2C2420] hover:bg-[#C5A880] hover:text-[#2C2420] text-xs font-semibold uppercase tracking-wider py-2 px-4 rounded-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add New Photographer</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {photographers.map((p) => (
                  <div
                    key={p.id}
                    className="p-5 bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] rounded-sm space-y-4 flex flex-col justify-between shadow-sm"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div
                          onClick={() => handleOpenEditPhotographer(p)}
                          className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#C5A880] shrink-0 cursor-pointer group shadow-sm bg-[#C5A880]/10"
                          title="Click to change photographer photo"
                        >
                          <Image
                            src={p.avatarUrl || "/backgrounds/camryn-portrait.jpg"}
                            alt={p.name}
                            fill
                            sizes="64px"
                            unoptimized={p.avatarUrl?.startsWith("data:") || p.avatarUrl?.startsWith("http")}
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <Camera className="w-4 h-4 text-white" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-serif-heading text-lg font-bold truncate">{p.name}</h4>
                          <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                            <span
                              className={`text-[9px] uppercase px-2 py-0.5 rounded font-bold inline-block ${
                                p.isLead
                                  ? "bg-[#C5A880] text-[#2C2420]"
                                  : "bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                              }`}
                            >
                              {p.role || (p.isLead ? "Owner / Photographer" : "Photographer")}
                            </span>
                            {p.instagram && (
                              <span className="text-[10px] text-[#C5A880] font-semibold truncate">
                                {p.instagram}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-3 leading-relaxed">
                        {p.bio || "Studio photographer documenting weddings and portraits."}
                      </p>

                      <div className="text-xs space-y-1 text-neutral-600 dark:text-neutral-300">
                        <div>📧 {p.email}</div>
                        <div>📱 {p.phone || "+27 82 555 0100"}</div>
                        {p.instagram && (
                          <div className="text-neutral-500 text-[11px]">
                            📸 <a href={`https://instagram.com/${p.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" className="hover:underline text-[#C5A880]">{p.instagram}</a>
                          </div>
                        )}
                        <div className="text-[#C5A880] font-semibold text-[11px]">
                          Specialties: {Array.isArray(p.specialties) ? p.specialties.join(", ") : "Weddings, Portraits"}
                        </div>
                        {p.rating && (
                          <div className="text-[11px] text-neutral-500 flex items-center gap-2">
                            <span>⭐ {p.rating} Rating</span>
                            {p.completedShoots !== undefined && (
                              <span>• {p.completedShoots} Shoots Done</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#EAE3D9] dark:border-[#3A332C] flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEditPhotographer(p)}
                        className="bg-[#2C2420] dark:bg-[#C5A880] text-white dark:text-[#2C2420] hover:bg-[#C5A880] hover:text-[#2C2420] text-xs font-semibold px-3 py-1.5 rounded-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit Profile & Photo</span>
                      </button>

                      {!p.isLead && (
                        <button
                          type="button"
                          onClick={() => handleDeletePhotographer(p.id, p.name)}
                          className="text-rose-500 hover:text-rose-700 text-xs font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                        >
                          <UserX className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= MODALS ================= */}

        {/* "Edit Booking" Form Modal */}
        {editingBooking && (
          <div
            className="fixed inset-0 z-[170] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setEditingBooking(null)}
          >
            <div
              className="bg-white dark:bg-[#1C1917] text-[#2C2420] dark:text-[#FAF8F5] w-full max-w-lg rounded-md p-6 border border-[#EAE3D9] dark:border-[#3A332C] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center border-b border-[#EAE3D9] dark:border-[#3A332C] pb-3">
                <div>
                  <h3 className="font-serif-heading text-xl font-normal">
                    Edit Booking: {editingBooking.bookingReference}
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    {editingBooking.customer.fullName} • {editingBooking.packageName}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingBooking(null)}
                  className="text-neutral-400 hover:text-neutral-600 text-sm p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400 mb-1">
                      Booking Status
                    </label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as BookingStatus)}
                      className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] p-2.5 rounded text-xs focus:outline-none focus:border-[#C5A880]"
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400 mb-1">
                      Payment Status
                    </label>
                    <select
                      value={editPaymentStatus}
                      onChange={(e) => setEditPaymentStatus(e.target.value as PaymentStatus)}
                      className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] p-2.5 rounded text-xs focus:outline-none focus:border-[#C5A880]"
                    >
                      <option value="Unpaid">Unpaid</option>
                      <option value="Deposit Paid">Deposit Paid</option>
                      <option value="Paid in Full">Paid in Full</option>
                      <option value="Pending">Pending</option>
                      <option value="Refunded">Refunded</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400 mb-1">
                      Date
                    </label>
                    <input
                      type="text"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                      placeholder="e.g. 2026-10-24"
                      className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] p-2.5 rounded text-xs focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400 mb-1">
                      Time Slot
                    </label>
                    <input
                      type="text"
                      value={editTimeSlot}
                      onChange={(e) => setEditTimeSlot(e.target.value)}
                      placeholder="e.g. 15:30 - 17:30 (Golden Hour)"
                      className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] p-2.5 rounded text-xs focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400 mb-1">
                    Assigned Photographer
                  </label>
                  <select
                    value={editPhotographerId}
                    onChange={(e) => setEditPhotographerId(e.target.value)}
                    className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] p-2.5 rounded text-xs focus:outline-none focus:border-[#C5A880]"
                  >
                    {photographers
                      .filter((p) => p.id !== "photo-associate" && !p.name.toLowerCase().includes("lethabo"))
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} {p.isLead || p.id === "photo-camryn" ? "(Owner / Lead)" : "(Associate)"}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400 mb-1">
                    Delivered Photo Gallery Link (Pixieset / Google Drive)
                  </label>
                  <input
                    type="url"
                    value={editGalleryUrl}
                    onChange={(e) => setEditGalleryUrl(e.target.value)}
                    placeholder="https://clientgallery.cbphotography.co.za/set123"
                    className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] p-2.5 rounded text-xs focus:outline-none focus:border-[#C5A880]"
                  />
                  <p className="text-[10px] text-neutral-400 mt-0.5">
                    Adding a link automatically marks the gallery ready in the Client Portal.
                  </p>
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400 mb-1">
                    Client Vision & Admin Notes
                  </label>
                  <textarea
                    rows={3}
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Enter any updated shoot details or notes..."
                    className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] p-2.5 rounded text-xs focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-[#EAE3D9] dark:border-[#3A332C]">
                  <button
                    type="button"
                    onClick={() => handleDeleteBooking(editingBooking.id, editingBooking.bookingReference)}
                    className="text-rose-500 hover:text-rose-700 font-semibold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Record</span>
                  </button>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingBooking(null)}
                      className="px-4 py-2 border border-[#EAE3D9] dark:border-[#3A332C] rounded uppercase text-[11px] font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSavingEdit}
                      className="px-5 py-2 bg-[#2C2420] dark:bg-[#C5A880] text-white dark:text-[#2C2420] rounded uppercase text-[11px] font-semibold hover:bg-[#C5A880] hover:text-[#2C2420] cursor-pointer shadow"
                    >
                      {isSavingEdit ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* "Manual / Walk-In Booking" Modal */}
        {showCreateBooking && (
          <div
            className="fixed inset-0 z-[170] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setShowCreateBooking(false)}
          >
            <div
              className="bg-white dark:bg-[#1C1917] text-[#2C2420] dark:text-[#FAF8F5] w-full max-w-lg rounded-md p-6 border border-[#EAE3D9] dark:border-[#3A332C] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center border-b border-[#EAE3D9] dark:border-[#3A332C] pb-3">
                <div>
                  <h3 className="font-serif-heading text-xl font-normal">Manual / Walk-in Booking</h3>
                  <p className="text-[11px] text-neutral-400">Record direct phone reservations & walk-in clients</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCreateBooking(false)}
                  className="text-neutral-400 hover:text-neutral-600 text-sm"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateManualBooking} className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400 mb-1">
                      Client Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={manualClientName}
                      onChange={(e) => setManualClientName(e.target.value)}
                      placeholder="e.g. Liam Govender"
                      className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] p-2.5 rounded text-xs focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400 mb-1">
                      Client Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={manualClientEmail}
                      onChange={(e) => setManualClientEmail(e.target.value)}
                      placeholder="liam.gov@gmail.com"
                      className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] p-2.5 rounded text-xs focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400 mb-1">
                      Phone / WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={manualClientPhone}
                      onChange={(e) => setManualClientPhone(e.target.value)}
                      className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] p-2.5 rounded text-xs focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400 mb-1">
                      Package / Tier
                    </label>
                    <input
                      type="text"
                      value={manualPackageName}
                      onChange={(e) => setManualPackageName(e.target.value)}
                      placeholder="e.g. Matric Dance Gold"
                      className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] p-2.5 rounded text-xs focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400 mb-1">
                      Shoot Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={manualDate}
                      onChange={(e) => setManualDate(e.target.value)}
                      className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] p-2.5 rounded text-xs focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400 mb-1">
                      Time Slot
                    </label>
                    <input
                      type="text"
                      value={manualTimeSlot}
                      onChange={(e) => setManualTimeSlot(e.target.value)}
                      placeholder="e.g. 15:30 - 17:30 (Golden Hour)"
                      className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] p-2.5 rounded text-xs focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400 mb-1">
                      Assigned Photographer
                    </label>
                    <select
                      value={manualPhotographerId}
                      onChange={(e) => setManualPhotographerId(e.target.value)}
                      className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] p-2.5 rounded text-xs focus:outline-none focus:border-[#C5A880]"
                    >
                      {photographers.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} {p.isLead || p.id === "photo-camryn" ? "(Owner / Lead)" : "(Associate)"}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400 mb-1">
                      Agreed Price (ZAR) *
                    </label>
                    <input
                      type="number"
                      required
                      value={manualPriceZAR}
                      onChange={(e) => setManualPriceZAR(Number(e.target.value))}
                      className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] p-2.5 rounded text-xs focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400 mb-1">
                    Venue / Shoot Location Name
                  </label>
                  <input
                    type="text"
                    value={manualVenue}
                    onChange={(e) => setManualVenue(e.target.value)}
                    placeholder="e.g. Walter Sisulu Botanical Gardens / Studio Base"
                    className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] p-2.5 rounded text-xs focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-[#EAE3D9] dark:border-[#3A332C]">
                  <button
                    type="button"
                    onClick={() => setShowCreateBooking(false)}
                    className="px-4 py-2 border border-[#EAE3D9] dark:border-[#3A332C] rounded uppercase text-[11px] font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreatingManual}
                    className="px-5 py-2 bg-[#2C2420] dark:bg-[#C5A880] text-white dark:text-[#2C2420] rounded uppercase text-[11px] font-semibold hover:bg-[#C5A880] hover:text-[#2C2420] cursor-pointer shadow"
                  >
                    {isCreatingManual ? "Logging..." : "Confirm & Save Booking"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* "Log Expense" Modal */}
        {showAddExpenseModal && (
          <div
            className="fixed inset-0 z-[170] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setShowAddExpenseModal(false)}
          >
            <div
              className="bg-white dark:bg-[#1C1917] text-[#2C2420] dark:text-[#FAF8F5] w-full max-w-md rounded-md p-6 border border-[#EAE3D9] dark:border-[#3A332C] shadow-2xl space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center border-b border-[#EAE3D9] dark:border-[#3A332C] pb-3">
                <div>
                  <h3 className="font-serif-heading text-xl font-normal">Log Studio Expense</h3>
                  <p className="text-[11px] text-neutral-400">Record equipment, cloud, fuel, or marketing costs</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddExpenseModal(false)}
                  className="text-neutral-400 hover:text-neutral-600 text-sm"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddExpense} className="space-y-3 text-xs">
                <div>
                  <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400 mb-1">
                    Expense Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={expenseTitle}
                    onChange={(e) => setExpenseTitle(e.target.value)}
                    placeholder="e.g. Godox Speedlight V1 Flash Tube Replacement"
                    className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] p-2.5 rounded text-xs focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400 mb-1">
                      Category *
                    </label>
                    <select
                      value={expenseCategory}
                      onChange={(e) => setExpenseCategory(e.target.value as ExpenseCategory)}
                      className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] p-2.5 rounded text-xs focus:outline-none focus:border-[#C5A880]"
                    >
                      <option value="Gear & Maintenance">Gear & Maintenance</option>
                      <option value="Studio Rent">Studio Rent</option>
                      <option value="Travel & Fuel">Travel & Fuel</option>
                      <option value="Cloud & Software">Cloud & Software</option>
                      <option value="Marketing & Ads">Marketing & Ads</option>
                      <option value="Miscellaneous">Miscellaneous</option>
                    </select>
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400 mb-1">
                      Amount (ZAR) *
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={expenseAmountZAR}
                      onChange={(e) => setExpenseAmountZAR(Number(e.target.value))}
                      className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] p-2.5 rounded text-xs focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400 mb-1">
                    Expense Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={expenseDate}
                    onChange={(e) => setExpenseDate(e.target.value)}
                    className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] p-2.5 rounded text-xs focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400 mb-1">
                    Description & Invoice Notes
                  </label>
                  <textarea
                    rows={2}
                    value={expenseDescription}
                    onChange={(e) => setExpenseDescription(e.target.value)}
                    placeholder="Enter supplier, receipt number, or reason for expense..."
                    className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] p-2.5 rounded text-xs focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-[#EAE3D9] dark:border-[#3A332C]">
                  <button
                    type="button"
                    onClick={() => setShowAddExpenseModal(false)}
                    className="px-4 py-2 border border-[#EAE3D9] dark:border-[#3A332C] rounded uppercase text-[11px] font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingExpense}
                    className="px-5 py-2 bg-[#2E5E43] text-white rounded uppercase text-[11px] font-semibold hover:bg-emerald-800 cursor-pointer shadow"
                  >
                    {isSubmittingExpense ? "Logging..." : "Save Expense Record"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= MODAL: EDIT PHOTOGRAPHER PROFILE & PHOTO ================= */}
        {editingPhotographer && (
          <div
            className="fixed inset-0 z-[170] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setEditingPhotographer(null)}
          >
            <div
              className="bg-white dark:bg-[#1C1917] text-[#2C2420] dark:text-[#FAF8F5] w-full max-w-lg rounded-md p-6 border border-[#EAE3D9] dark:border-[#3A332C] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center border-b border-[#EAE3D9] dark:border-[#3A332C] pb-3">
                <div>
                  <h3 className="font-serif-heading text-xl font-normal">
                    Edit Photographer: {editingPhotographer.name}
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    Update profile bio, contact info, calendar availability & profile picture
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingPhotographer(null)}
                  className="text-neutral-400 hover:text-neutral-600 text-sm p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSavePhotographerEdit} className="space-y-4 text-xs">
                {/* Photo & Avatar Upload Section */}
                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-[#FAF8F5] dark:bg-[#141210] rounded-sm border border-[#EAE3D9] dark:border-[#3A332C]">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[#C5A880] shadow-md shrink-0 bg-[#C5A880]/10">
                    <Image
                      src={editPhotoAvatarUrl || "/backgrounds/camryn-portrait.jpg"}
                      alt={editPhotoName || "Photographer"}
                      fill
                      sizes="80px"
                      unoptimized={editPhotoAvatarUrl?.startsWith("data:") || editPhotoAvatarUrl?.startsWith("http")}
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-2 flex-1 text-center sm:text-left">
                    <div className="font-semibold text-xs text-[#2C2420] dark:text-[#FAF8F5]">
                      Photographer Profile Picture
                    </div>
                    <p className="text-[11px] text-neutral-500">
                      Upload any updated photo from your computer or pick from the studio library presets below.
                    </p>
                    <label className="inline-flex items-center gap-1.5 bg-[#2C2420] dark:bg-[#C5A880] text-white dark:text-[#2C2420] hover:bg-[#C5A880] hover:text-[#2C2420] text-[11px] font-semibold uppercase tracking-wider py-1.5 px-3 rounded cursor-pointer transition-colors shadow-sm">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Choose Photo File</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handlePhotoFileUpload(e, "edit")}
                      />
                    </label>
                  </div>
                </div>

                {/* Preset Studio Library Photos */}
                <div>
                  <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400 mb-1.5">
                    Or Select Studio Portrait Preset
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {[
                      { label: "Camryn", src: "/backgrounds/camryn-portrait.jpg" },
                      { label: "Miah", src: "/backgrounds/miah-portrait.jpg" },
                      { label: "Brendon", src: "/backgrounds/brendon-portrait.jpg" },
                      { label: "Wedding Solo", src: "/portfolio/wedding-solo-1.jpg" },
                      { label: "Corporate", src: "/portfolio/corporate-solo-1.jpg" },
                      { label: "Portrait", src: "/portfolio/solo-1.jpg" }
                    ].map((item) => (
                      <button
                        key={item.src}
                        type="button"
                        onClick={() => setEditPhotoAvatarUrl(item.src)}
                        className={`relative rounded overflow-hidden border-2 aspect-square cursor-pointer transition-all ${
                          editPhotoAvatarUrl === item.src
                            ? "border-[#C5A880] scale-105 shadow-md ring-2 ring-[#C5A880]/50"
                            : "border-transparent opacity-75 hover:opacity-100"
                        }`}
                        title={item.label}
                      >
                        <Image src={item.src} alt={item.label} fill sizes="60px" className="object-cover" />
                        <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[8px] text-white text-center py-0.5 truncate">
                          {item.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400 mb-1">
                    Photo URL or Local Path
                  </label>
                  <input
                    type="text"
                    value={editPhotoAvatarUrl}
                    onChange={(e) => setEditPhotoAvatarUrl(e.target.value)}
                    placeholder="/backgrounds/camryn-portrait.jpg or https://..."
                    className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] p-2 rounded text-xs focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                {/* Name & Role */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={editPhotoName}
                      onChange={(e) => setEditPhotoName(e.target.value)}
                      className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] p-2.5 rounded text-xs focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                  <div>
                    <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400 mb-1">
                      Role Title
                    </label>
                    <input
                      type="text"
                      value={editPhotoRole}
                      onChange={(e) => setEditPhotoRole(e.target.value)}
                      placeholder="e.g. Owner / Photographer"
                      className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] p-2.5 rounded text-xs focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="editPhotoIsLead"
                    checked={editPhotoIsLead}
                    onChange={(e) => setEditPhotoIsLead(e.target.checked)}
                    className="w-4 h-4 accent-[#C5A880]"
                  />
                  <label htmlFor="editPhotoIsLead" className="text-xs font-semibold cursor-pointer">
                    Studio Lead Photographer (Featured primary photographer)
                  </label>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400 mb-1">
                      Studio Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={editPhotoEmail}
                      onChange={(e) => setEditPhotoEmail(e.target.value)}
                      className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] p-2.5 rounded text-xs focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                  <div>
                    <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400 mb-1">
                      Phone / WhatsApp Number
                    </label>
                    <input
                      type="text"
                      value={editPhotoPhone}
                      onChange={(e) => setEditPhotoPhone(e.target.value)}
                      className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] p-2.5 rounded text-xs focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                </div>

                {/* Instagram Handle */}
                <div>
                  <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400 mb-1">
                    Instagram Handle (e.g. @camrynburgerphoto)
                  </label>
                  <input
                    type="text"
                    value={editPhotoInstagram}
                    onChange={(e) => setEditPhotoInstagram(e.target.value)}
                    placeholder="@username"
                    className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] p-2.5 rounded text-xs focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400 mb-1">
                    Photographer Biography
                  </label>
                  <textarea
                    rows={3}
                    value={editPhotoBio}
                    onChange={(e) => setEditPhotoBio(e.target.value)}
                    placeholder="Short summary of background, experience and artistic style..."
                    className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] p-2.5 rounded text-xs focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                {/* Specialties */}
                <div>
                  <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400 mb-1">
                    Specialties (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={editPhotoSpecialties}
                    onChange={(e) => setEditPhotoSpecialties(e.target.value)}
                    placeholder="Weddings, Matric Dance, Portraits, Couples"
                    className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] p-2.5 rounded text-xs focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                {/* Available Days */}
                <div>
                  <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400 mb-1.5">
                    Available Days
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => {
                      const isSelected = editPhotoAvailableDays.includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => {
                            setEditPhotoAvailableDays((prev) =>
                              isSelected ? prev.filter((d) => d !== day) : [...prev, day]
                            );
                          }}
                          className={`px-3 py-1 text-xs rounded font-semibold cursor-pointer transition-colors ${
                            isSelected
                              ? "bg-[#C5A880] text-[#2C2420]"
                              : "bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-300"
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Rating & Completed Shoots */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400 mb-1">
                      Rating (1.0 - 5.0)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      max="5"
                      value={editPhotoRating}
                      onChange={(e) => setEditPhotoRating(Number(e.target.value))}
                      className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] p-2.5 rounded text-xs focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                  <div>
                    <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400 mb-1">
                      Completed Shoots Count
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editPhotoCompletedShoots}
                      onChange={(e) => setEditPhotoCompletedShoots(Number(e.target.value))}
                      className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] p-2.5 rounded text-xs focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-[#EAE3D9] dark:border-[#3A332C]">
                  <button
                    type="button"
                    onClick={() => setEditingPhotographer(null)}
                    className="px-4 py-2 border border-[#EAE3D9] dark:border-[#3A332C] rounded uppercase text-[11px] font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingPhotographer}
                    className="px-5 py-2 bg-[#2C2420] dark:bg-[#C5A880] text-white dark:text-[#2C2420] rounded uppercase text-[11px] font-semibold hover:bg-[#C5A880] hover:text-[#2C2420] cursor-pointer shadow"
                  >
                    {isSavingPhotographer ? "Saving..." : "Save Photographer Profile"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= MODAL: EDIT PACKAGE ================= */}
        {editingPackage && (
          <div
            className="fixed inset-0 z-[170] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setEditingPackage(null)}
          >
            <div
              className="bg-white dark:bg-[#1C1917] text-[#2C2420] dark:text-[#FAF8F5] w-full max-w-lg rounded-md p-6 border border-[#EAE3D9] dark:border-[#3A332C] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center border-b border-[#EAE3D9] dark:border-[#3A332C] pb-3">
                <div>
                  <h3 className="font-serif-heading text-xl font-normal">
                    Edit Package: {editingPackage.package.name}
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    Update pricing, deliverables, and description
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingPackage(null)}
                  className="text-neutral-400 hover:text-neutral-600 text-sm p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEditPackage} className="space-y-3.5 text-xs">
                <div>
                  <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400 mb-1">
                    Package Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editPkgName}
                    onChange={(e) => setEditPkgName(e.target.value)}
                    placeholder="e.g. Signature Gold Heirloom"
                    className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] p-2.5 rounded text-xs focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400 mb-1">
                    Short Tagline / Summary *
                  </label>
                  <input
                    type="text"
                    required
                    value={editPkgTagline}
                    onChange={(e) => setEditPkgTagline(e.target.value)}
                    placeholder="e.g. 50 edited images, sunset location"
                    className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] p-2.5 rounded text-xs focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400 mb-1">
                      Price (ZAR) *
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      step={50}
                      value={editPkgPrice}
                      onChange={(e) => setEditPkgPrice(Number(e.target.value))}
                      className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] p-2.5 rounded text-xs focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                  <div>
                    <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400 mb-1">
                      Duration (Hours) *
                    </label>
                    <input
                      type="number"
                      required
                      min={0.5}
                      step={0.5}
                      value={editPkgDuration}
                      onChange={(e) => setEditPkgDuration(Number(e.target.value))}
                      className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] p-2.5 rounded text-xs focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                  <div>
                    <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400 mb-1">
                      Edited Photos *
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={editPkgImages}
                      onChange={(e) => setEditPkgImages(Number(e.target.value))}
                      className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] p-2.5 rounded text-xs focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400 mb-1">
                    Included Features (One per line)
                  </label>
                  <textarea
                    rows={4}
                    value={editPkgFeatures}
                    onChange={(e) => setEditPkgFeatures(e.target.value)}
                    placeholder="2 Hours dedicated shooting&#10;50 Hand-crafted high-resolution images&#10;Private download gallery"
                    className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] p-2.5 rounded text-xs focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="editPkgPopular"
                    checked={editPkgPopular}
                    onChange={(e) => setEditPkgPopular(e.target.checked)}
                    className="w-4 h-4 accent-[#C5A880]"
                  />
                  <label htmlFor="editPkgPopular" className="text-xs font-semibold cursor-pointer">
                    Highlight as "Most Popular" / Client Favorite package
                  </label>
                </div>

                {/* Package Showcase Photo */}
                <div className="p-3 bg-[#FAF8F5] dark:bg-[#141210] rounded border border-[#EAE3D9] dark:border-[#3A332C] space-y-2">
                  <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400">
                    Package Showcase Photo (Card Banner)
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="relative w-16 h-16 rounded overflow-hidden border border-[#C5A880]/40 shrink-0 bg-[#C5A880]/10">
                      <Image
                        src={editPkgImageUrl || "/backgrounds/demo-wedding.jpg"}
                        alt="Preview"
                        fill
                        sizes="64px"
                        unoptimized={editPkgImageUrl.startsWith("data:") || editPkgImageUrl.startsWith("http")}
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <label className="inline-flex items-center gap-1.5 bg-[#2C2420] dark:bg-[#C5A880] text-white dark:text-[#2C2420] text-[10px] font-semibold uppercase tracking-wider py-1 px-2.5 rounded cursor-pointer transition-colors shadow-sm">
                        <Upload className="w-3 h-3" />
                        <span>Upload From Device</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleMediaFileUpload(e, "editPkg")}
                        />
                      </label>
                      <input
                        type="text"
                        value={editPkgImageUrl}
                        onChange={(e) => setEditPkgImageUrl(e.target.value)}
                        placeholder="Or image URL (e.g. /backgrounds/demo-matric.jpg)"
                        className="w-full bg-white dark:bg-[#1C1917] border border-[#EAE3D9] dark:border-[#3A332C] p-1.5 rounded text-xs focus:outline-none focus:border-[#C5A880]"
                      />
                    </div>
                  </div>
                  {/* Studio Presets */}
                  <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
                    {[
                      { label: "Matric", src: "/backgrounds/demo-matric.jpg" },
                      { label: "Wedding", src: "/backgrounds/demo-wedding.jpg" },
                      { label: "Portrait", src: "/portfolio/solo-1.jpg" },
                      { label: "Couples", src: "/backgrounds/demo-couples.jpg" },
                      { label: "Corporate", src: "/backgrounds/demo-corporate.jpg" },
                      { label: "Graduation", src: "/backgrounds/demo-graduation.jpg" }
                    ].map((p) => (
                      <button
                        key={p.src}
                        type="button"
                        onClick={() => setEditPkgImageUrl(p.src)}
                        className={`px-2 py-0.5 rounded text-[10px] border transition-colors cursor-pointer shrink-0 ${
                          editPkgImageUrl === p.src
                            ? "border-[#C5A880] bg-[#C5A880] text-[#2C2420] font-bold"
                            : "border-neutral-300 dark:border-neutral-700 hover:border-[#C5A880] text-neutral-500"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-[#EAE3D9] dark:border-[#3A332C]">
                  <button
                    type="button"
                    onClick={() => setEditingPackage(null)}
                    className="px-4 py-2 border border-[#EAE3D9] dark:border-[#3A332C] rounded uppercase text-[11px] font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingPackageEdit}
                    className="px-5 py-2 bg-[#2C2420] dark:bg-[#C5A880] text-white dark:text-[#2C2420] rounded uppercase text-[11px] font-semibold hover:bg-[#C5A880] hover:text-[#2C2420] cursor-pointer shadow"
                  >
                    {isSavingPackageEdit ? "Saving..." : "Save Package Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= MODAL: ADD NEW PACKAGE ================= */}
        {showAddPackageModal && (
          <div
            className="fixed inset-0 z-[170] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setShowAddPackageModal(false)}
          >
            <div
              className="bg-white dark:bg-[#1C1917] text-[#2C2420] dark:text-[#FAF8F5] w-full max-w-lg rounded-md p-6 border border-[#EAE3D9] dark:border-[#3A332C] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center border-b border-[#EAE3D9] dark:border-[#3A332C] pb-3">
                <div>
                  <h3 className="font-serif-heading text-xl font-normal">Add New Photography Package</h3>
                  <p className="text-[11px] text-neutral-400">
                    Create a new pricing tier and add it to the studio offerings
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddPackageModal(false)}
                  className="text-neutral-400 hover:text-neutral-600 text-sm p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddPackage} className="space-y-3.5 text-xs">
                <div>
                  <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400 mb-1">
                    Service Category *
                  </label>
                  <select
                    value={newPkgServiceId}
                    onChange={(e) => setNewPkgServiceId(e.target.value)}
                    required
                    className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] p-2.5 rounded text-xs focus:outline-none focus:border-[#C5A880]"
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400 mb-1">
                    Package Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newPkgName}
                    onChange={(e) => setNewPkgName(e.target.value)}
                    placeholder="e.g. Sunset Golden Hour Mini"
                    className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] p-2.5 rounded text-xs focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400 mb-1">
                    Short Tagline / Highlights *
                  </label>
                  <input
                    type="text"
                    required
                    value={newPkgTagline}
                    onChange={(e) => setNewPkgTagline(e.target.value)}
                    placeholder="e.g. 45 edited images, 2 outfit changes, outdoor venue"
                    className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] p-2.5 rounded text-xs focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400 mb-1">
                      Price (ZAR) *
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      step={50}
                      value={newPkgPrice}
                      onChange={(e) => setNewPkgPrice(Number(e.target.value))}
                      className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] p-2.5 rounded text-xs focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                  <div>
                    <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400 mb-1">
                      Duration (Hours) *
                    </label>
                    <input
                      type="number"
                      required
                      min={0.5}
                      step={0.5}
                      value={newPkgDuration}
                      onChange={(e) => setNewPkgDuration(Number(e.target.value))}
                      className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] p-2.5 rounded text-xs focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                  <div>
                    <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400 mb-1">
                      Edited Photos *
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={newPkgImages}
                      onChange={(e) => setNewPkgImages(Number(e.target.value))}
                      className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] p-2.5 rounded text-xs focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400 mb-1">
                    Included Features (One item per line)
                  </label>
                  <textarea
                    rows={4}
                    value={newPkgFeatures}
                    onChange={(e) => setNewPkgFeatures(e.target.value)}
                    placeholder="1.5 Hours shoot time in prime golden hour light&#10;50 Hand-crafted edited photos&#10;Private high-resolution online gallery&#10;Online print store access"
                    className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] p-2.5 rounded text-xs focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="newPkgPopular"
                    checked={newPkgPopular}
                    onChange={(e) => setNewPkgPopular(e.target.checked)}
                    className="w-4 h-4 accent-[#C5A880]"
                  />
                  <label htmlFor="newPkgPopular" className="text-xs font-semibold cursor-pointer">
                    Highlight as "Most Popular" / Best Seller package
                  </label>
                </div>

                {/* Package Showcase Photo */}
                <div className="p-3 bg-[#FAF8F5] dark:bg-[#141210] rounded border border-[#EAE3D9] dark:border-[#3A332C] space-y-2">
                  <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400">
                    Package Showcase Photo (Card Banner)
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="relative w-16 h-16 rounded overflow-hidden border border-[#C5A880]/40 shrink-0 bg-[#C5A880]/10">
                      <Image
                        src={newPkgImageUrl || "/backgrounds/demo-wedding.jpg"}
                        alt="Preview"
                        fill
                        sizes="64px"
                        unoptimized={newPkgImageUrl.startsWith("data:") || newPkgImageUrl.startsWith("http")}
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <label className="inline-flex items-center gap-1.5 bg-[#2C2420] dark:bg-[#C5A880] text-white dark:text-[#2C2420] text-[10px] font-semibold uppercase tracking-wider py-1 px-2.5 rounded cursor-pointer transition-colors shadow-sm">
                        <Upload className="w-3 h-3" />
                        <span>Upload From Device</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleMediaFileUpload(e, "newPkg")}
                        />
                      </label>
                      <input
                        type="text"
                        value={newPkgImageUrl}
                        onChange={(e) => setNewPkgImageUrl(e.target.value)}
                        placeholder="Or image URL (e.g. /backgrounds/demo-matric.jpg)"
                        className="w-full bg-white dark:bg-[#1C1917] border border-[#EAE3D9] dark:border-[#3A332C] p-1.5 rounded text-xs focus:outline-none focus:border-[#C5A880]"
                      />
                    </div>
                  </div>
                  {/* Studio Presets */}
                  <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
                    {[
                      { label: "Matric", src: "/backgrounds/demo-matric.jpg" },
                      { label: "Wedding", src: "/backgrounds/demo-wedding.jpg" },
                      { label: "Portrait", src: "/portfolio/solo-1.jpg" },
                      { label: "Couples", src: "/backgrounds/demo-couples.jpg" },
                      { label: "Corporate", src: "/backgrounds/demo-corporate.jpg" },
                      { label: "Graduation", src: "/backgrounds/demo-graduation.jpg" }
                    ].map((p) => (
                      <button
                        key={p.src}
                        type="button"
                        onClick={() => setNewPkgImageUrl(p.src)}
                        className={`px-2 py-0.5 rounded text-[10px] border transition-colors cursor-pointer shrink-0 ${
                          newPkgImageUrl === p.src
                            ? "border-[#C5A880] bg-[#C5A880] text-[#2C2420] font-bold"
                            : "border-neutral-300 dark:border-neutral-700 hover:border-[#C5A880] text-neutral-500"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-[#EAE3D9] dark:border-[#3A332C]">
                  <button
                    type="button"
                    onClick={() => setShowAddPackageModal(false)}
                    className="px-4 py-2 border border-[#EAE3D9] dark:border-[#3A332C] rounded uppercase text-[11px] font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingPackage}
                    className="px-5 py-2 bg-[#2C2420] dark:bg-[#C5A880] text-white dark:text-[#2C2420] rounded uppercase text-[11px] font-semibold hover:bg-[#C5A880] hover:text-[#2C2420] cursor-pointer shadow"
                  >
                    {isSubmittingPackage ? "Creating..." : "Create & Publish Package"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= MODAL: ADD NEW SERVICE CATEGORY ================= */}
        {showAddServiceModal && (
          <div
            className="fixed inset-0 z-[170] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setShowAddServiceModal(false)}
          >
            <div
              className="bg-white dark:bg-[#1C1917] text-[#2C2420] dark:text-[#FAF8F5] w-full max-w-lg rounded-md p-6 border border-[#EAE3D9] dark:border-[#3A332C] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center border-b border-[#EAE3D9] dark:border-[#3A332C] pb-3">
                <div>
                  <h3 className="font-serif-heading text-xl font-normal">Create New Photography Category</h3>
                  <p className="text-[11px] text-neutral-400">
                    Launch a brand-new photography service offering with custom cover photo and tiers
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddServiceModal(false)}
                  className="text-neutral-400 hover:text-neutral-600 text-sm p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateService} className="space-y-3.5 text-xs">
                <div>
                  <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400 mb-1">
                    Category Name / Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newServiceTitle}
                    onChange={(e) => setNewServiceTitle(e.target.value)}
                    placeholder="e.g. Maternity & Newborn, Boudoir, Pets, Real Estate"
                    className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] p-2.5 rounded text-xs focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400 mb-1">
                    Short Tagline *
                  </label>
                  <input
                    type="text"
                    required
                    value={newServiceTagline}
                    onChange={(e) => setNewServiceTagline(e.target.value)}
                    placeholder="e.g. Celebrating expectant mothers and delicate newborn arrivals."
                    className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] p-2.5 rounded text-xs focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400 mb-1">
                    Detailed Overview / Description
                  </label>
                  <textarea
                    rows={2}
                    value={newServiceDescription}
                    onChange={(e) => setNewServiceDescription(e.target.value)}
                    placeholder="Describe the aesthetic approach, experience, and emotional value..."
                    className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] p-2.5 rounded text-xs focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                {/* Category Cover Photo */}
                <div className="p-3 bg-[#FAF8F5] dark:bg-[#141210] rounded border border-[#EAE3D9] dark:border-[#3A332C] space-y-2">
                  <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400">
                    Category Cover Photo *
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="relative w-16 h-16 rounded overflow-hidden border border-[#C5A880]/40 shrink-0 bg-[#C5A880]/10">
                      <Image
                        src={newServiceImageUrl || "/backgrounds/demo-wedding.jpg"}
                        alt="Preview"
                        fill
                        sizes="64px"
                        unoptimized={newServiceImageUrl.startsWith("data:") || newServiceImageUrl.startsWith("http")}
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <label className="inline-flex items-center gap-1.5 bg-[#2C2420] dark:bg-[#C5A880] text-white dark:text-[#2C2420] text-[10px] font-semibold uppercase tracking-wider py-1 px-2.5 rounded cursor-pointer transition-colors shadow-sm">
                        <Upload className="w-3 h-3" />
                        <span>Upload From Device</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleMediaFileUpload(e, "newServ")}
                        />
                      </label>
                      <input
                        type="text"
                        value={newServiceImageUrl}
                        onChange={(e) => setNewServiceImageUrl(e.target.value)}
                        placeholder="Or image URL (e.g. /backgrounds/demo-wedding.jpg)"
                        className="w-full bg-white dark:bg-[#1C1917] border border-[#EAE3D9] dark:border-[#3A332C] p-1.5 rounded text-xs focus:outline-none focus:border-[#C5A880]"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
                    {[
                      { label: "Wedding", src: "/backgrounds/demo-wedding.jpg" },
                      { label: "Matric", src: "/backgrounds/demo-matric.jpg" },
                      { label: "Portrait", src: "/portfolio/solo-1.jpg" },
                      { label: "Couples", src: "/backgrounds/demo-couples.jpg" },
                      { label: "Corporate", src: "/backgrounds/demo-corporate.jpg" },
                      { label: "Graduation", src: "/backgrounds/demo-graduation.jpg" }
                    ].map((p) => (
                      <button
                        key={p.src}
                        type="button"
                        onClick={() => setNewServiceImageUrl(p.src)}
                        className={`px-2 py-0.5 rounded text-[10px] border transition-colors cursor-pointer shrink-0 ${
                          newServiceImageUrl === p.src
                            ? "border-[#C5A880] bg-[#C5A880] text-[#2C2420] font-bold"
                            : "border-neutral-300 dark:border-neutral-700 hover:border-[#C5A880] text-neutral-500"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Initial Package Tier */}
                <div className="p-3 bg-[#FAF8F5] dark:bg-[#141210] rounded border border-[#EAE3D9] dark:border-[#3A332C] space-y-2.5">
                  <span className="block uppercase tracking-wider text-[10px] font-bold text-[#C5A880]">
                    Initial Package Tier Inside Category
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-neutral-400 mb-0.5">Tier Name *</label>
                      <input
                        type="text"
                        required
                        value={newServiceTierName}
                        onChange={(e) => setNewServiceTierName(e.target.value)}
                        placeholder="e.g. Signature Session"
                        className="w-full bg-white dark:bg-[#1C1917] border border-[#EAE3D9] dark:border-[#3A332C] p-2 rounded text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-neutral-400 mb-0.5">Starting Price (ZAR) *</label>
                      <input
                        type="number"
                        required
                        min={0}
                        step={50}
                        value={newServiceTierPrice}
                        onChange={(e) => setNewServiceTierPrice(Number(e.target.value))}
                        className="w-full bg-white dark:bg-[#1C1917] border border-[#EAE3D9] dark:border-[#3A332C] p-2 rounded text-xs"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-neutral-400 mb-0.5">Duration (Hours)</label>
                      <input
                        type="number"
                        min={0.5}
                        step={0.5}
                        value={newServiceTierDuration}
                        onChange={(e) => setNewServiceTierDuration(Number(e.target.value))}
                        className="w-full bg-white dark:bg-[#1C1917] border border-[#EAE3D9] dark:border-[#3A332C] p-2 rounded text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-neutral-400 mb-0.5">Edited Photos</label>
                      <input
                        type="number"
                        min={1}
                        value={newServiceTierImages}
                        onChange={(e) => setNewServiceTierImages(Number(e.target.value))}
                        className="w-full bg-white dark:bg-[#1C1917] border border-[#EAE3D9] dark:border-[#3A332C] p-2 rounded text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-[#EAE3D9] dark:border-[#3A332C]">
                  <button
                    type="button"
                    onClick={() => setShowAddServiceModal(false)}
                    className="px-4 py-2 border border-[#EAE3D9] dark:border-[#3A332C] rounded uppercase text-[11px] font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingService}
                    className="px-5 py-2 bg-[#2C2420] dark:bg-[#C5A880] text-white dark:text-[#2C2420] rounded uppercase text-[11px] font-semibold hover:bg-[#C5A880] hover:text-[#2C2420] cursor-pointer shadow"
                  >
                    {isSubmittingService ? "Creating..." : "Create Category & Tier"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= MODAL: EDIT SERVICE CATEGORY ================= */}
        {editingService && (
          <div
            className="fixed inset-0 z-[170] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setEditingService(null)}
          >
            <div
              className="bg-white dark:bg-[#1C1917] text-[#2C2420] dark:text-[#FAF8F5] w-full max-w-lg rounded-md p-6 border border-[#EAE3D9] dark:border-[#3A332C] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center border-b border-[#EAE3D9] dark:border-[#3A332C] pb-3">
                <div>
                  <h3 className="font-serif-heading text-xl font-normal">
                    Edit Category: {editingService.title}
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    Update category title, tagline, description, and cover photo
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="text-neutral-400 hover:text-neutral-600 text-sm p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveServiceEdit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400 mb-1">
                    Category Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editServiceTitle}
                    onChange={(e) => setEditServiceTitle(e.target.value)}
                    className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] p-2.5 rounded text-xs focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400 mb-1">
                    Short Tagline *
                  </label>
                  <input
                    type="text"
                    required
                    value={editServiceTagline}
                    onChange={(e) => setEditServiceTagline(e.target.value)}
                    className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] p-2.5 rounded text-xs focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={editServiceDescription}
                    onChange={(e) => setEditServiceDescription(e.target.value)}
                    className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] p-2.5 rounded text-xs focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                {/* Category Cover Photo */}
                <div className="p-3 bg-[#FAF8F5] dark:bg-[#141210] rounded border border-[#EAE3D9] dark:border-[#3A332C] space-y-2">
                  <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400">
                    Category Cover Photo
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="relative w-16 h-16 rounded overflow-hidden border border-[#C5A880]/40 shrink-0 bg-[#C5A880]/10">
                      <Image
                        src={editServiceImageUrl || "/backgrounds/demo-wedding.jpg"}
                        alt="Preview"
                        fill
                        sizes="64px"
                        unoptimized={editServiceImageUrl.startsWith("data:") || editServiceImageUrl.startsWith("http")}
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <label className="inline-flex items-center gap-1.5 bg-[#2C2420] dark:bg-[#C5A880] text-white dark:text-[#2C2420] text-[10px] font-semibold uppercase tracking-wider py-1 px-2.5 rounded cursor-pointer transition-colors shadow-sm">
                        <Upload className="w-3 h-3" />
                        <span>Upload From Device</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleMediaFileUpload(e, "editServ")}
                        />
                      </label>
                      <input
                        type="text"
                        value={editServiceImageUrl}
                        onChange={(e) => setEditServiceImageUrl(e.target.value)}
                        placeholder="Or image URL (e.g. /backgrounds/demo-wedding.jpg)"
                        className="w-full bg-white dark:bg-[#1C1917] border border-[#EAE3D9] dark:border-[#3A332C] p-1.5 rounded text-xs focus:outline-none focus:border-[#C5A880]"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
                    {[
                      { label: "Wedding", src: "/backgrounds/demo-wedding.jpg" },
                      { label: "Matric", src: "/backgrounds/demo-matric.jpg" },
                      { label: "Portrait", src: "/portfolio/solo-1.jpg" },
                      { label: "Couples", src: "/backgrounds/demo-couples.jpg" },
                      { label: "Corporate", src: "/backgrounds/demo-corporate.jpg" },
                      { label: "Graduation", src: "/backgrounds/demo-graduation.jpg" }
                    ].map((p) => (
                      <button
                        key={p.src}
                        type="button"
                        onClick={() => setEditServiceImageUrl(p.src)}
                        className={`px-2 py-0.5 rounded text-[10px] border transition-colors cursor-pointer shrink-0 ${
                          editServiceImageUrl === p.src
                            ? "border-[#C5A880] bg-[#C5A880] text-[#2C2420] font-bold"
                            : "border-neutral-300 dark:border-neutral-700 hover:border-[#C5A880] text-neutral-500"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-[#EAE3D9] dark:border-[#3A332C]">
                  <button
                    type="button"
                    onClick={() => setEditingService(null)}
                    className="px-4 py-2 border border-[#EAE3D9] dark:border-[#3A332C] rounded uppercase text-[11px] font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingServiceEdit}
                    className="px-5 py-2 bg-[#2C2420] dark:bg-[#C5A880] text-white dark:text-[#2C2420] rounded uppercase text-[11px] font-semibold hover:bg-[#C5A880] hover:text-[#2C2420] cursor-pointer shadow"
                  >
                    {isSavingServiceEdit ? "Saving..." : "Save Category Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= MODAL: ADD PHOTOGRAPHER ================= */}
        {showAddPhotoModal && (
          <div
            className="fixed inset-0 z-[170] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setShowAddPhotoModal(false)}
          >
            <div
              className="bg-white dark:bg-[#1C1917] text-[#2C2420] dark:text-[#FAF8F5] w-full max-w-md rounded-md p-6 border border-[#EAE3D9] dark:border-[#3A332C] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center border-b border-[#EAE3D9] dark:border-[#3A332C] pb-3">
                <h3 className="font-serif-heading text-xl font-normal">Add Associate Photographer</h3>
                <button
                  type="button"
                  onClick={() => setShowAddPhotoModal(false)}
                  className="text-neutral-400 hover:text-neutral-600 text-sm"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddPhotographer} className="space-y-3.5 text-xs">
                {/* Photo upload and preview */}
                <div className="flex items-center gap-3 p-3 bg-[#FAF8F5] dark:bg-[#141210] rounded border border-[#EAE3D9] dark:border-[#3A332C]">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden border border-[#C5A880] shrink-0 bg-[#C5A880]/10">
                    <Image
                      src={newPhotoAvatarUrl || "/backgrounds/miah-portrait.jpg"}
                      alt="Avatar"
                      fill
                      sizes="56px"
                      unoptimized={newPhotoAvatarUrl?.startsWith("data:") || newPhotoAvatarUrl?.startsWith("http")}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <span className="text-[11px] font-semibold block">Profile Photo</span>
                    <label className="inline-flex items-center gap-1.5 bg-[#2C2420] dark:bg-[#C5A880] text-white dark:text-[#2C2420] text-[10px] font-semibold uppercase tracking-wider py-1 px-2.5 rounded cursor-pointer transition-colors">
                      <Upload className="w-3 h-3" />
                      <span>Upload Picture</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handlePhotoFileUpload(e, "add")}
                      />
                    </label>
                  </div>
                </div>

                {/* Preset Studio Library Photos */}
                <div>
                  <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400 mb-1">
                    Or Select Preset Photo
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {[
                      { label: "Miah", src: "/backgrounds/miah-portrait.jpg" },
                      { label: "Brendon", src: "/backgrounds/brendon-portrait.jpg" },
                      { label: "Camryn", src: "/backgrounds/camryn-portrait.jpg" },
                      { label: "Wedding", src: "/portfolio/wedding-solo-1.jpg" },
                      { label: "Corporate", src: "/portfolio/corporate-solo-1.jpg" },
                      { label: "Portrait", src: "/portfolio/solo-1.jpg" }
                    ].map((item) => (
                      <button
                        key={item.src}
                        type="button"
                        onClick={() => setNewPhotoAvatarUrl(item.src)}
                        className={`relative rounded overflow-hidden border-2 aspect-square cursor-pointer transition-all ${
                          newPhotoAvatarUrl === item.src
                            ? "border-[#C5A880] scale-105 shadow-md ring-2 ring-[#C5A880]/50"
                            : "border-transparent opacity-75 hover:opacity-100"
                        }`}
                        title={item.label}
                      >
                        <Image src={item.src} alt={item.label} fill sizes="50px" className="object-cover" />
                        <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[7px] text-white text-center py-0.5 truncate">
                          {item.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newPhotoName}
                    onChange={(e) => setNewPhotoName(e.target.value)}
                    placeholder="e.g. Siyabonga Khumalo"
                    className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] p-2.5 rounded text-xs focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400 mb-1">
                    Role Title
                  </label>
                  <input
                    type="text"
                    value={newPhotoRole}
                    onChange={(e) => setNewPhotoRole(e.target.value)}
                    placeholder="e.g. Associate Photographer"
                    className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] p-2.5 rounded text-xs focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400 mb-1">
                    Studio Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={newPhotoEmail}
                    onChange={(e) => setNewPhotoEmail(e.target.value)}
                    placeholder="siya@cbphotography.co.za"
                    className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] p-2.5 rounded text-xs focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400 mb-1">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={newPhotoPhone}
                    onChange={(e) => setNewPhotoPhone(e.target.value)}
                    placeholder="+27 82 555 1234"
                    className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] p-2.5 rounded text-xs focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400 mb-1">
                    Instagram Handle (Optional)
                  </label>
                  <input
                    type="text"
                    value={newPhotoInstagram}
                    onChange={(e) => setNewPhotoInstagram(e.target.value)}
                    placeholder="@username"
                    className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] p-2.5 rounded text-xs focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400 mb-1">
                    Biography
                  </label>
                  <textarea
                    rows={2}
                    value={newPhotoBio}
                    onChange={(e) => setNewPhotoBio(e.target.value)}
                    placeholder="Short bio for client portal and about page..."
                    className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] p-2.5 rounded text-xs focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-[10px] font-bold text-neutral-400 mb-1">
                    Specialties (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={newPhotoSpecialties}
                    onChange={(e) => setNewPhotoSpecialties(e.target.value)}
                    placeholder="Weddings, Matric Dances, Studio"
                    className="w-full bg-[#FAF8F5] dark:bg-[#141210] border border-[#EAE3D9] dark:border-[#3A332C] p-2.5 rounded text-xs focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-[#EAE3D9] dark:border-[#3A332C]">
                  <button
                    type="button"
                    onClick={() => setShowAddPhotoModal(false)}
                    className="px-4 py-2 border border-[#EAE3D9] dark:border-[#3A332C] rounded uppercase text-[11px] font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingPhoto}
                    className="px-5 py-2 bg-[#2C2420] dark:bg-[#C5A880] text-white dark:text-[#2C2420] rounded uppercase text-[11px] font-semibold hover:bg-[#C5A880] hover:text-[#2C2420] cursor-pointer shadow"
                  >
                    {isSubmittingPhoto ? "Saving..." : "Add to Team"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
