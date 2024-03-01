const MenuSatuan = require("../models/MenuSatuan");
const fs = require("fs").promises;

/**
 * Get all menu satuan.
 * Endpoint: GET /menu-satuan
 */
const getMenuSatuan = async (req, res) => {
  try {
    // Fetch all menu satuan data from the database
    const data = await MenuSatuan.all();
    res.status(200).json({ message: "Get menu satuan success", data });
  } catch (error) {
    // Handle errors and respond with an error message
    res.status(400).json({ message: error.message });
  }
};

/**
 * Create a new menu satuan.
 * Endpoint: POST /menu-satuan
 */
const createMenuSatuan = async (req, res) => {
  const allowedColumns = ["name", "image", "category"];
  const values = {};

  // Extract allowed columns from the request body
  allowedColumns.forEach((column) => {
    if (column !== "image") {
      values[column] = req.body[column];
    } else {
      // If there is an image in the request, use its filename
      if (req.file) {
        values[column] = req.file.filename;
      }
    }
  });

  try {
    // Create a new menu satuan in the database
    const { insertId } = await MenuSatuan.create(values);

    // Fetch the newly created menu satuan data
    const data = await MenuSatuan.find(insertId);

    // Respond with success and the newly created menu satuan data
    res
      .status(200)
      .json({ message: "New menu satuan created successfully", data });
  } catch (error) {
    // Handle errors and respond with an error message
    res.status(400).json({ message: error.message });
  }
};

/**
 * Update menu satuan by ID.
 * Endpoint: PATCH /menu-satuan/:id
 */
const updateMenuSatuan = async (req, res) => {
  const menuSatuanId = req.params.id;
  const allowedColumns = ["name", "description", "image", "category", "price"];
  let updateQuery = "UPDATE menu_satuan SET ";
  const updatedColumns = [];
  const values = [];
  let isImageUpdate = false;

  // Build the update query and values based on allowed columns
  allowedColumns.forEach((allowedColumn) => {
    if (allowedColumn === "image") {
      if (req.file) {
        updatedColumns.push("image = ?");
        values.push(req.file.filename);
        isImageUpdate = true;
      }
    } else if (req.body[allowedColumn] !== undefined) {
      updatedColumns.push(`${allowedColumn} = ?`);
      values.push(req.body[allowedColumn]);
    }
  });

  // Ensure at least one data field is updated
  if (updatedColumns.length === 0) {
    return res
      .status(400)
      .json({ error: "At least one data should be updated" });
  }

  // Construct the full update query
  updateQuery += updatedColumns.join(", ");
  updateQuery += " WHERE menu_satuan_id = ?";
  values.push(menuSatuanId);

  try {
    // If image is updated, delete the old image from the server
    if (isImageUpdate) {
      const [{ image }] = await MenuSatuan.find(menuSatuanId);
      await fs.unlink(process.env.STATIC_IMAGE_DIRNAME + image);
    }

    // Update the menu satuan in the database
    await MenuSatuan.update(updateQuery, values);

    // Fetch the updated menu satuan
    const data = await MenuSatuan.find(menuSatuanId);

    // Check if data does not exist
    if (data.length === 0) {
      throw Error(`Menu satuan with id ${menuSatuanId} does not exist`);
    }

    // Respond with success and the updated menu satuan data
    res.status(200).json({ message: "Menu satuan updated successfully", data });
  } catch (error) {
    // Handle errors and respond with an error message
    res.status(500).json({ error: error.message });
  }
};

/**
 * Delete menu satuan by ID.
 * Endpoint: DELETE /menu-satuan/:id
 */
const deleteMenuSatuan = async (req, res) => {
  const menuSatuanId = req.params.id;
  try {
    // Fetch the menu satuan data to be deleted
    const data = await MenuSatuan.find(menuSatuanId);

    // Check if data does not exist
    if (data.length === 0) {
      throw Error(`Menu satuan with id ${menuSatuanId} does not exist`);
    }

    // Delete the image associated with the menu satuan from the server
    await fs.unlink(process.env.STATIC_IMAGE_DIRNAME + data[0].image);

    // Delete the menu satuan from the database
    await MenuSatuan.deleteMenuSatuan(menuSatuanId);

    // Respond with success and the deleted menu satuan data
    res.status(200).json({
      message: `Menu satuan with id = ${menuSatuanId} deleted successfully`,
      data,
    });
  } catch (error) {
    // Handle errors and respond with an error message
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getMenuSatuan,
  createMenuSatuan,
  updateMenuSatuan,
  deleteMenuSatuan,
};
