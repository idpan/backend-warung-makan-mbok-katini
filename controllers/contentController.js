const Content = require("../models/Content");
const fs = require("fs").promises; // Use fs.promises for asynchronous file operations

/**
 * Transform content data for a more structured response.
 * @param {Object} data - Raw content data.
 * @returns {Object} - Transformed content data.
 */
const responseContent = (data) => {
  return {
    hero: {
      heading: data.heading,
      description: data.description,
      image: data.hero_image,
    },
    section1: {
      image: data.section1_image,
      description: data.section1_description,
    },
    section2: {
      image: data.section2_image,
      description: data.section2_description,
    },
  };
};

/**
 * Get content.
 * Endpoint: GET /content
 */
const getContent = async (req, res) => {
  try {
    // Fetch content data from the database
    const [data] = await Content.all();

    // Respond with success and the transformed content data
    res
      .status(200)
      .json({ message: "Get content success", data: responseContent(data) });
  } catch (error) {
    // Handle errors and respond with an error message
    res.status(400).json({ message: error.message });
  }
};

/**
 * Update content by ID.
 * Endpoint: PATCH /content/:id
 */
const updateContent = async (req, res) => {
  const contentId = req.params.id;
  const allowedColumns = [
    "heading",
    "description",
    "hero_image",
    "section1_image",
    "section1_description",
    "section2_image",
    "section2_description",
  ];
  let updateQuery = "UPDATE content SET ";
  const updatedColumns = [];
  const values = [];
  let updatedImageCollumn = "";
  let isImageUpdated = false;
  // Build the update query and values based on allowed columns

  allowedColumns.forEach((allowedColumn) => {
    if (
      allowedColumn === "hero_image" ||
      allowedColumn === "section1_image" ||
      allowedColumn === "section2_image"
    ) {
      if (req.files[allowedColumn]) {
        const file = req.files[allowedColumn][0];

        if (file.fieldname === allowedColumn) {
          updatedImageCollumn = file.fieldname;
          updatedColumns.push(`${file.fieldname} = ?`);
          values.push(file.filename);
          isImageUpdated = true;
        }
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
  updateQuery += " WHERE id_content = ?";
  values.push(contentId);

  try {
    // If image is updated, delete the old image from the server
    if (isImageUpdated) {
      const [data] = await Content.all(); // Retrieve old image filename
      await fs.unlink(
        process.env.STATIC_IMAGE_DIRNAME + data[updatedImageCollumn]
      );
    }

    // Update content in the database
    await Content.update(updateQuery, values);

    // Fetch the updated content
    const [data] = await Content.all();

    // Respond with success and the transformed updated content data
    res.status(200).json({
      message: "Content updated successfully",
      data: responseContent(data),
    });
  } catch (error) {
    // Handle errors and respond with an error message
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getContent, updateContent };
