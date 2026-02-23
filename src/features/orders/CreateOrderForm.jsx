import { useState } from "react";
import styled from "styled-components";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Select from "../../ui/Select";
import Button from "../../ui/Button";
import Spinner from "../../ui/Spinner";
import Input from "../../ui/Input";
import { useCheckedInBookings } from "./useCheckedInBookings";
import { useCreateOrder } from "./useCreateOrder";
import { useItems } from "../common/useItems";
import { getMenuItems } from "../../services/apiMenu";
import { HiPlus, HiTrash } from "react-icons/hi2";
import { formatCurrency, getAccommodationName } from "../../utils/helpers";

const ItemRow = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 2fr 0.6fr auto;
  gap: 1.2rem;
  align-items: center;
  margin-bottom: 1.2rem;

  @media (max-width: 600px) {
    grid-template-columns: 1fr 1fr;
    & > *:nth-child(1),
    & > *:nth-child(2) {
      grid-column: span 2;
    }
  }
`;

const FormHeader = styled.h3`
  font-size: 1.8rem;
  font-weight: 500;
  margin-bottom: 2rem;
`;

function CreateOrderForm() {
  const { checkedInBookings, isLoading: isLoadingBookings } =
    useCheckedInBookings();
  const { items: menuItems, isLoading: isLoadingMenu } = useItems(
    "menu",
    getMenuItems,
  );
  const { createOrder, isCreating } = useCreateOrder();

  const [selectedBookingId, setSelectedBookingId] = useState("");
  const [orderItems, setOrderItems] = useState([
    { category: "all", menuItemId: "", quantity: 1 },
  ]);

  if (isLoadingBookings || isLoadingMenu) return <Spinner />;

  // Prepare booking options for select
  const bookingOptions = [
    { value: "", label: "Select a checked-in guest..." },
    ...(checkedInBookings?.map((b) => ({
      value: b.id,
      label: `${b.guests.fullName} (${getAccommodationName(b)} - Booking #${b.id})`,
    })) || []),
  ];

  // Get unique categories for the category filter dropdown
  const categories = [
    "all",
    ...new Set(menuItems?.map((m) => m.category).filter(Boolean) || []),
  ];

  const categoryOptions = categories.map((cat) => ({
    value: cat,
    label: cat === "all" ? "All Categories" : cat,
  }));

  // Helper to get menu options for a specific category
  function getMenuOptions(category) {
    const filtered =
      category === "all"
        ? menuItems
        : menuItems?.filter((m) => m.category === category);

    return [
      { value: "", label: "Select an item..." },
      ...(filtered?.map((m) => ({
        value: m.id,
        label: `${m.name} - ${formatCurrency(m.price)}`,
      })) || []),
    ];
  }

  function handleAddItem() {
    setOrderItems([
      ...orderItems,
      { category: "all", menuItemId: "", quantity: 1 },
    ]);
  }

  function handleRemoveItem(index) {
    if (orderItems.length === 1) return;
    setOrderItems(orderItems.filter((_, i) => i !== index));
  }

  function handleItemChange(index, field, value) {
    const newItems = [...orderItems];
    newItems[index][field] = value;
    setOrderItems(newItems);
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!selectedBookingId) {
      alert("Please select a guest");
      return;
    }

    const validItems = orderItems.filter((item) => item.menuItemId !== "");
    if (validItems.length === 0) {
      alert("Please add at least one item to the order");
      return;
    }

    const booking = checkedInBookings.find(
      (b) => String(b.id) === selectedBookingId,
    );

    // Calculate total price and map items for DB insertions
    let totalPrice = 0;
    const itemsForDb = validItems.map((item) => {
      const menuItem = menuItems.find(
        (m) => String(m.id) === String(item.menuItemId),
      );
      totalPrice += menuItem.price * item.quantity;
      return {
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        unitPrice: menuItem.price,
      };
    });

    const newOrder = {
      guestId: booking.guests.id,
      bookingId: booking.id,
      totalPrice,
      status: "ordered",
      isPaid: false,
    };

    createOrder(
      { newOrder, items: itemsForDb },
      {
        onSuccess: () => {
          setSelectedBookingId("");
          setOrderItems([{ category: "all", menuItemId: "", quantity: 1 }]);
        },
      },
    );
  }

  return (
    <Form
      onSubmit={handleSubmit}
      type="regular"
      style={{ marginBottom: "3rem" }}
    >
      <FormHeader>Create New Order</FormHeader>

      <FormRow label="Guest">
        <Select
          options={bookingOptions}
          value={selectedBookingId}
          onChange={(e) => setSelectedBookingId(e.target.value)}
          disabled={isCreating}
        />
      </FormRow>

      <div style={{ marginTop: "2.4rem" }}>
        <label
          style={{
            display: "block",
            fontSize: "1.4rem",
            fontWeight: "500",
            marginBottom: "1.2rem",
          }}
        >
          Order Items
        </label>

        {orderItems.map((item, index) => (
          <ItemRow key={index}>
            <Select
              options={categoryOptions}
              value={item.category}
              onChange={(e) => {
                handleItemChange(index, "category", e.target.value);
                // Reset menu item when category changes
                handleItemChange(index, "menuItemId", "");
              }}
              disabled={isCreating}
            />
            <Select
              options={getMenuOptions(item.category)}
              value={item.menuItemId}
              onChange={(e) =>
                handleItemChange(index, "menuItemId", e.target.value)
              }
              disabled={isCreating}
            />
            <Input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) =>
                handleItemChange(index, "quantity", Number(e.target.value))
              }
              disabled={isCreating}
            />
            <Button
              type="button"
              variation="danger"
              size="small"
              onClick={() => handleRemoveItem(index)}
              disabled={orderItems.length === 1 || isCreating}
            >
              <HiTrash />
            </Button>
          </ItemRow>
        ))}

        <Button
          type="button"
          variation="secondary"
          size="small"
          onClick={handleAddItem}
          disabled={isCreating}
          style={{ marginTop: "1.2rem" }}
        >
          <HiPlus /> Add Another Item
        </Button>
      </div>

      <FormRow>
        <Button disabled={isCreating}>Create Order</Button>
      </FormRow>
    </Form>
  );
}

export default CreateOrderForm;
