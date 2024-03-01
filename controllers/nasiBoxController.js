const NasiBox = require("../models/NasiBox");
const fs = require("fs").promises;

/**
 * Get all nasi box.
 * Endpoint: GET /nasi-box
 */
const getNasiBox = async (req, res) => {
  try {
    // Retrieve all nasi box data from the database
    const data = await NasiBox.all();

    // Respond with success and the retrieved data
    res.status(200).json({ message: "Get nasi box success", data });
  } catch (error) {
    // Handle errors and respond with an error message
    res.status(400).json({ message: error.message });
  }
};

/**
 * Create a new nasi box.
 * Endpoint: POST /nasi-box
 */
const createNasiBox = async (req, res) => {
  const allowedColumns = ["name", "description", "image", "category", "price"];
  const values = {};

  // Extract allowed fields from the request body
  allowedColumns.forEach((key) => {
    if (key !== "image") {
      values[key] = req.body[key];
    } else {
      // If image is present in the request, use its filename
      if (req.file) {
        values[key] = req.file.filename;
      }
    }
  });

  try {
    // Create a new nasi box in the database
    const { insertId } = await NasiBox.create(values);

    // Retrieve the newly created nasi box
    const data = await NasiBox.find(insertId);

    // Respond with success and the newly created nasi box data
    res
      .status(200)
      .json({ message: "New nasi box created successfully", data });
  } catch (error) {
    // Handle errors and respond with an error message
    res.status(400).json({ message: error.message });
  }
};

/**
 * Update a nasi box by ID.
 * Endpoint: PATCH /nasi-box/:id
 */
const updateNasiBox = async (req, res) => {
  const nasiBoxId = req.params.id;
  const allowedColumns = ["name", "description", "image", "category", "price"];
  let updateQuery = "UPDATE nasi_box SET ";
  const updatedColumns = [];
  const values = [];
  let isImageUpdated = false;

  // Build the update query and values based on allowed fields
  allowedColumns.forEach((allowedColumn) => {
    if (allowedColumn === "image") {
      if (req.file) {
        updatedColumns.push("image = ?");
        values.push(req.file.filename);
        isImageUpdated = true;
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
  updateQuery += " WHERE nasi_box_id = ?";
  values.push(nasiBoxId);

  try {
    // If image is updated, delete the old image from the server
    if (isImageUpdated) {
      const [{ image }] = await NasiBox.find(nasiBoxId); // Retrieve old image filename
      await fs.unlink(process.env.STATIC_IMAGE_DIRNAME + image);
    }

    // Update the nasi box in the database
    await NasiBox.update(updateQuery, values);

    // Retrieve the updated nasi box
    const data = await NasiBox.find(nasiBoxId);

    // Check if data does not exist
    if (data.length === 0) {
      throw Error(`Nasi box with id ${nasiBoxId} does not exist`);
    }

    // Respond with success and the updated nasi box data
    res.status(200).json({ message: "Nasi box updated successfully", data });
  } catch (error) {
    // Handle errors and respond with an error message
    res.status(500).json({ error: error.message });
  }
};

/**
 * Delete a nasi box by ID.
 * Endpoint: DELETE /nasi-box/:id
 */
const deleteNasiBox = async (req, res) => {
  const nasiBoxId = req.params.id;

  try {
    // Retrieve the nasi box data to be deleted
    const data = await NasiBox.find(nasiBoxId);

    // Check if data does not exist
    if (data.length === 0) {
      throw Error(`Nasi box with id ${nasiBoxId} does not exist`);
    }

    // Delete the image associated with the nasi box from the server
    await fs.unlink(process.env.STATIC_IMAGE_DIRNAME + data[0].image);

    // Delete the nasi box from the database
    await NasiBox.deleteNasiBox(nasiBoxId);

    // Respond with success and the deleted nasi box data
    res.status(200).json({
      message: `Nasi box with id = ${nasiBoxId} deleted successfully`,
      data,
    });
  } catch (error) {
    // Handle errors and respond with an error message
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getNasiBox,
  createNasiBox,
  updateNasiBox,
  deleteNasiBox,
};
