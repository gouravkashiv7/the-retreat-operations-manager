// components/guests/GuestForm.jsx
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useCreateGuest, useUpdateGuest } from "./useGuests";
import Button from "../../ui/Button";
import Spinner from "../../ui/Spinner";
import supabase from "../../services/supabase";
import toast from "react-hot-toast";
import { 
  HiCheckCircle,
  HiXCircle,
  HiPhoto,
  HiXMark
} from "react-icons/hi2";
import {
  Form,
  FormRow,
  FormGroup,
  Label,
  Input,
  Select,
  TextArea,
  ErrorMessage,
  ButtonGroup,
  FullWidth,
  FormHeader,
  RequiredIndicator,
  WizardContainer,
  WizardHeader,
  OptionsGrid,
  OptionCard,
  UploadGrid,
  UploadBox,
  StepNavigation,
  RemoveButton
} from "./GuestForm.styles";

const COUNTRIES = [
  "United States", "Canada", "United Kingdom", "Australia", "Germany",
  "France", "Japan", "South Korea", "India", "Brazil", "Mexico",
  "Spain", "Italy", "Netherlands", "Switzerland", "Sweden", "Norway",
  "Denmark", "Finland", "United Arab Emirates", "Singapore", "Malaysia",
  "Thailand", "China", "South Africa", "New Zealand",
].sort();

const ID_TYPES_INDIA = ["Aadhaar", "PAN", "Voter ID", "Driving License", "Passport", "Other Govt ID"];

function GuestForm({ guest, onCloseModal }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();
  
  const createGuestMutation = useCreateGuest();
  const updateGuestMutation = useUpdateGuest();

  // Wizard state
  const [step, setStep] = useState(guest ? 2 : 1);
  const [hasIdAvailable, setHasIdAvailable] = useState(null); 
  const [selectedIdType, setSelectedIdType] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(!guest ? "India" : "");
  
  // Image states
  const [idFront, setIdFront] = useState(null);
  const [idFrontPreview, setIdFrontPreview] = useState(null);
  const [idBack, setIdBack] = useState(null);
  const [idBackPreview, setIdBackPreview] = useState(null);
  
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (guest) {
      reset({
        fullName: guest.fullName || "",
        email: guest.email || "",
        nationalId: guest.nationalId || "",
        country: guest.country || "",
        phone: guest.phone || "",
        idType: guest.idType || "",
        address: guest.address || "",
      });
      setSelectedCountry(guest.country || "");
      setSelectedIdType(guest.idType || "");
      
      if (guest.guestIDCard) setIdFrontPreview(guest.guestIDCard);
      if (guest.guestIDCardBack) setIdBackPreview(guest.guestIDCardBack);
    }
  }, [guest, reset]);

  const isForeigner = selectedCountry !== "India";

  useEffect(() => {
    if (step === 1 && !guest && selectedCountry) {
      if (selectedCountry !== "India") {
        setHasIdAvailable(true);
        setSelectedIdType("Passport");
      } else if (hasIdAvailable === null) {
         // Reset if switching back to India only if not already set
        // setSelectedIdType("");
      }
    }
  }, [selectedCountry, step, guest, hasIdAvailable]);

  const isLoading = createGuestMutation.isLoading || updateGuestMutation.isLoading || isScanning;

  const onSubmit = (data) => {
    const guestData = {
      ...data,
      phone: data.phone ? parseInt(data.phone) : null,
      country: selectedCountry || data.country,
      idType: selectedIdType || data.idType,
      guestIDCard: idFront || guest?.guestIDCard || null,
      guestIDCardBack: idBack || guest?.guestIDCardBack || null,
    };

    if (guest) {
      updateGuestMutation.mutate(
        { id: guest.id, updates: guestData },
        { onSuccess: () => { reset(); onCloseModal?.(); } }
      );
    } else {
      createGuestMutation.mutate(guestData, {
        onSuccess: () => { reset(); onCloseModal?.(); }
      });
    }
  };

  const toBase64 = (file) => new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });

  const handleScanAndProceed = async () => {
    if (hasIdAvailable === false && !isForeigner) {
      setStep(2);
      return;
    }

    if (!idFront) {
      toast.error("Please provide at least the front side of the ID.");
      return;
    }
    
    if (!selectedIdType) {
      toast.error("Please select an ID Type.");
      return;
    }

    setIsScanning(true);
    const toastId = toast.loading("Analyzing ID document...");

    try {
      const imagesPayload = [];
      imagesPayload.push(await toBase64(idFront));
      if (idBack) imagesPayload.push(await toBase64(idBack));

      const { data, error } = await supabase.functions.invoke("extract-id-data", {
        body: { images: imagesPayload },
      });

      if (error) throw error;

      if (data.fullName) setValue("fullName", data.fullName);
      if (data.nationalId) setValue("nationalId", data.nationalId);
      if (data.address) setValue("address", data.address);

      setValue("country", selectedCountry);
      setValue("idType", selectedIdType);

      toast.success("Document scanned successfully!", { id: toastId });
      setStep(2);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to scan ID. Please enter manually.", { id: toastId });
      setValue("country", selectedCountry);
      setValue("idType", selectedIdType);
      setStep(2);
    } finally {
      setIsScanning(false);
    }
  };

  const handleImageUpload = (e, side) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (side === 'front') {
      setIdFront(file);
      setIdFrontPreview(URL.createObjectURL(file));
    } else {
      setIdBack(file);
      setIdBackPreview(URL.createObjectURL(file));
    }
    e.target.value = "";
  };

  const removeImage = (side, e) => {
    e.preventDefault();
    if (side === 'front') {
      setIdFront(null);
      setIdFrontPreview(null);
    } else {
      setIdBack(null);
      setIdBackPreview(null);
    }
  };

  if (step === 1 && !guest) {
    return (
      <WizardContainer>
        <WizardHeader>
          <h2>Add New Guest</h2>
          <p>Step 1 of 2: Guest Origin & ID Verification</p>
        </WizardHeader>

        <FormGroup>
          <Label>Guest Country <RequiredIndicator>*</RequiredIndicator></Label>
          <Select value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)}>
            <option value="">Select a country</option>
            {COUNTRIES.map((country) => (
              <option key={country} value={country}>{country}</option>
            ))}
          </Select>
        </FormGroup>

        {selectedCountry && selectedCountry === "India" && (
          <FormGroup style={{ marginTop: "1rem" }}>
            <Label style={{ textAlign: "center", marginBottom: "0.5rem" }}>Is the guest's ID document available?</Label>
            <OptionsGrid>
              <OptionCard $selected={hasIdAvailable === true} onClick={() => setHasIdAvailable(true)}>
                <HiCheckCircle />
                <div>
                  <h3>Yes, I have it</h3>
                  <p>Upload photos to magically autofill details</p>
                </div>
              </OptionCard>
              <OptionCard $selected={hasIdAvailable === false} onClick={() => setHasIdAvailable(false)}>
                <HiXCircle />
                <div>
                  <h3>No, enter manually</h3>
                  <p>Fill out the guest details from scratch</p>
                </div>
              </OptionCard>
            </OptionsGrid>
          </FormGroup>
        )}

        {selectedCountry && hasIdAvailable === true && (
          <>
            <FormGroup style={{ marginTop: isForeigner ? "1rem" : "2rem" }}>
              <Label>Select ID Type <RequiredIndicator>*</RequiredIndicator></Label>
              <Select value={selectedIdType} onChange={(e) => setSelectedIdType(e.target.value)} disabled={isForeigner}>
                <option value="">Select ID type</option>
                {!isForeigner ? (
                  ID_TYPES_INDIA.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))
                ) : (
                  <option value="Passport">Passport (Mandatory for non-Indians)</option>
                )}
              </Select>
            </FormGroup>

            {selectedIdType && (
              <FormGroup>
                <Label>Upload ID Photos</Label>
                <UploadGrid>
                  <UploadBox $hasImage={!!idFrontPreview}>
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'front')} />
                    {idFrontPreview ? (
                      <>
                        <img src={idFrontPreview} alt="Front ID" />
                        <RemoveButton onClick={(e) => removeImage('front', e)}><HiXMark /></RemoveButton>
                      </>
                    ) : (
                      <><HiPhoto /><span>Front Side (Required)</span></>
                    )}
                  </UploadBox>
                  <UploadBox $hasImage={!!idBackPreview}>
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'back')} />
                    {idBackPreview ? (
                      <>
                        <img src={idBackPreview} alt="Back ID" />
                        <RemoveButton onClick={(e) => removeImage('back', e)}><HiXMark /></RemoveButton>
                      </>
                    ) : (
                      <><HiPhoto /><span>Back Side (Optional)</span></>
                    )}
                  </UploadBox>
                </UploadGrid>
              </FormGroup>
            )}
          </>
        )}

        <StepNavigation>
          <Button $variation="secondary" onClick={onCloseModal} disabled={isScanning}>Cancel</Button>
          <Button 
            onClick={handleScanAndProceed} 
            disabled={!selectedCountry || (selectedCountry === "India" && hasIdAvailable === null) || isScanning || (hasIdAvailable && (!idFront || !selectedIdType))}
          >
            {isScanning ? <><Spinner size="small" /> Processing...</> : hasIdAvailable ? "Scan & Continue" : "Continue to Details"}
          </Button>
        </StepNavigation>
      </WizardContainer>
    );
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormHeader>{guest ? "Edit Guest" : "Add New Guest (Step 2 of 2)"}</FormHeader>

      <FormRow>
        <FormGroup>
          <Label htmlFor="fullName">Full Name <RequiredIndicator>*</RequiredIndicator></Label>
          <Input
            id="fullName"
            type="text"
            className={errors.fullName ? "error" : ""}
            {...register("fullName", { required: "Full name is required", minLength: { value: 2, message: "Full name must be at least 2 characters" } })}
            placeholder="Enter full name"
          />
          {errors.fullName && <ErrorMessage>{errors.fullName.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="email">Email Address <RequiredIndicator>*</RequiredIndicator></Label>
          <Input
            id="email"
            type="email"
            className={errors.email ? "error" : ""}
            {...register("email", { 
              required: "Email address is required",
              pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email address" } 
            })}
            placeholder="Enter email address"
          />
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        </FormGroup>
      </FormRow>

      <FormRow>
        <FormGroup>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="1234567890"
            {...register("phone", { pattern: { value: /^[0-9]+$/, message: "Phone number must contain only digits" }, minLength: { value: 10, message: "Phone number must be at least 10 digits" } })}
          />
          {errors.phone && <ErrorMessage>{errors.phone.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="country">Country</Label>
          <Select
            id="country"
            value={selectedCountry}
            disabled={!guest}
            onChange={(e) => setSelectedCountry(e.target.value)}
          >
            <option value="">Select a country</option>
            {COUNTRIES.map((country) => (
              <option key={country} value={country}>{country}</option>
            ))}
          </Select>
        </FormGroup>
      </FormRow>

      <FormRow>
        <FormGroup>
          <Label htmlFor="idType">ID Type</Label>
          <Select id="idType" value={selectedIdType} disabled={!guest} onChange={(e) => setSelectedIdType(e.target.value)}>
            <option value="">Select ID type</option>
            {ID_TYPES_INDIA.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
            <option value="Passport">Passport</option>
            <option value="National ID">National ID</option>
            <option value="Driver License">Driver License</option>
            <option value="Other">Other</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="nationalId">National ID / Passport Number</Label>
          <Input id="nationalId" type="text" {...register("nationalId")} placeholder="Enter ID or passport number" />
        </FormGroup>
      </FormRow>

      <FullWidth>
        <FormGroup>
          <Label htmlFor="address">Address</Label>
          <TextArea id="address" {...register("address")} placeholder="Full street address, city, state, and zip code" />
        </FormGroup>
      </FullWidth>

      {(idFrontPreview || idBackPreview) && (
        <FullWidth>
          <FormGroup>
            <Label>Identity Documents (Provided in Step 1)</Label>
            <div style={{ display: "flex", gap: "1.5rem", marginTop: "0.5rem", flexWrap: "wrap" }}>
              {idFrontPreview && (
                <div style={{ textAlign: "center" }}>
                  <img src={idFrontPreview} alt="Front ID" style={{ maxWidth: "240px", height: "140px", objectFit: "contain", borderRadius: "var(--border-radius-md)", border: "1px solid var(--color-grey-300)", backgroundColor: "var(--color-grey-100)", padding: "4px" }} />
                  <span style={{ fontSize: "1.2rem", color: "var(--color-grey-500)", display: "block", marginTop: "0.5rem" }}>Front Side</span>
                </div>
              )}
              {idBackPreview && (
                <div style={{ textAlign: "center" }}>
                  <img src={idBackPreview} alt="Back ID" style={{ maxWidth: "240px", height: "140px", objectFit: "contain", borderRadius: "var(--border-radius-md)", border: "1px solid var(--color-grey-300)", backgroundColor: "var(--color-grey-100)", padding: "4px" }} />
                  <span style={{ fontSize: "1.2rem", color: "var(--color-grey-500)", display: "block", marginTop: "0.5rem" }}>Back Side</span>
                </div>
              )}
            </div>
            {guest && (
              <div style={{ marginTop: "1rem" }}>
                 <Label style={{ fontSize: "1.2rem" }}>Upload New Front/Back Images (Optional):</Label>
                 <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
                   <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'front')} style={{ fontSize: "1.2rem" }} />
                   <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'back')} style={{ fontSize: "1.2rem" }} />
                 </div>
              </div>
            )}
          </FormGroup>
        </FullWidth>
      )}

      {!idFrontPreview && !idBackPreview && guest && (
         <FullWidth>
           <FormGroup>
             <Label>Upload Identification Documents</Label>
             <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'front')} />
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'back')} />
             </div>
           </FormGroup>
         </FullWidth>
      )}

      <ButtonGroup>
        {!guest && (
          <Button type="button" $variation="secondary" onClick={() => setStep(1)} disabled={isLoading} style={{ marginRight: "auto" }}>
            Back to Step 1
          </Button>
        )}
        <Button type="button" $variation="secondary" onClick={onCloseModal} disabled={isLoading}>Cancel</Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <><Spinner size="small" /> {guest ? "Updating..." : "Creating..."}</> : guest ? "Update Guest" : "Create Guest"}
        </Button>
      </ButtonGroup>
    </Form>
  );
}

export default GuestForm;
