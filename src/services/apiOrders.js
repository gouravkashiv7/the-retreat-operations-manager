import supabase from "./supabase";

export async function getOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *, 
      guests(*), 
      order_items(*, menu_items(*)), 
      bookings(
        *,
        booking_cabins(cabins(name)),
        booking_rooms(rooms(name))
      )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    throw new Error("Orders could not be loaded.");
  }

  return data;
}

export async function getCheckedInBookings() {
  const { data, error } = await supabase
    .from("bookings")
    .select(
      `
      id, 
      status, 
      guests(id, fullName, email),
      booking_cabins(cabins(name)),
      booking_rooms(rooms(name))
    `,
    )
    .eq("status", "checked-in");

  if (error) {
    console.error(error);
    throw new Error("Checked-in bookings could not be loaded.");
  }

  return data;
}

export async function createOrder({ newOrder, items }) {
  // 1. Create order
  const { data: orderData, error: orderError } = await supabase
    .from("orders")
    .insert([newOrder])
    .select()
    .single();

  if (orderError) {
    console.error(orderError);
    throw new Error("Order could not be created");
  }

  // 2. Prepare items with orderId
  const orderItems = items.map((item) => ({
    orderId: orderData.id,
    menuItemId: item.menuItemId,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
  }));

  // 3. Insert items
  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    // Attempt rollback
    await supabase.from("orders").delete().eq("id", orderData.id);
    console.error(itemsError);
    throw new Error("Order items could not be added. Order creation failed.");
  }

  return orderData;
}

export async function updateOrderStatus({
  id,
  status,
  expectedDeliveryTime,
  isPaid,
}) {
  let updateData = { status };
  if (expectedDeliveryTime !== undefined)
    updateData.expectedDeliveryTime = expectedDeliveryTime;
  if (isPaid !== undefined) updateData.isPaid = isPaid;

  const { data, error } = await supabase
    .from("orders")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Order could not be updated");
  }

  return data;
}
