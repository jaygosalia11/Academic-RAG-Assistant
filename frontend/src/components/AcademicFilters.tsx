
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import {
  DEPARTMENTS,
  BATCH_YEARS,
  SEMESTER_LEVELS,
} from "../constants/academic";

interface Props {
  department: string;
  batchYear: string;
  semesterLevel: string;

  setDepartment: React.Dispatch<
    React.SetStateAction<string>
  >;

  setBatchYear: React.Dispatch<
    React.SetStateAction<string>
  >;

  setSemesterLevel: React.Dispatch<
    React.SetStateAction<string>
  >;
}

function AcademicFilters({
  department,
  batchYear,
  semesterLevel,
  setDepartment,
  setBatchYear,
  setSemesterLevel,
}: Props) {
  const labelSx = {
    color: "#fff",

    "&.Mui-focused": {
      color: "#fff",
    },
  };

  const selectSx = {
    color: "#fff",

    ".MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(255,255,255,0.2)",
    },

    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(255,255,255,0.4)",
    },

    ".MuiSvgIcon-root": {
      color: "#fff",
    },
  };

  return (
    <Grid container spacing={2}>
      {/* Department */}

      <Grid size={{ xs: 12, md: 4 }}>
        <FormControl fullWidth>
          <InputLabel sx={labelSx}>
            Department
          </InputLabel>

          <Select
            value={department}
            label="Department"
            onChange={(event) =>
              setDepartment(
                event.target.value
              )
            }
            sx={selectSx}
          >
            {DEPARTMENTS.map(
              (department) => (
                <MenuItem
                  key={department}
                  value={department}
                >
                  {department}
                </MenuItem>
              )
            )}
          </Select>
        </FormControl>
      </Grid>

      {/* Batch Year */}

      <Grid size={{ xs: 12, md: 4 }}>
        <FormControl fullWidth>
          <InputLabel sx={labelSx}>
            Batch Year
          </InputLabel>

          <Select
            value={batchYear}
            label="Batch Year"
            onChange={(event) =>
              setBatchYear(
                event.target.value
              )
            }
            sx={selectSx}
          >
            {BATCH_YEARS.map(
              (batchYear) => (
                <MenuItem
                  key={batchYear}
                  value={batchYear}
                >
                  {batchYear}
                </MenuItem>
              )
            )}
          </Select>
        </FormControl>
      </Grid>

      {/* Semester */}

      <Grid size={{ xs: 12, md: 4 }}>
        <FormControl fullWidth>
          <InputLabel sx={labelSx}>
            Semester
          </InputLabel>

          <Select
            value={semesterLevel}
            label="Semester"
            onChange={(event) =>
              setSemesterLevel(
                event.target.value
              )
            }
            sx={selectSx}
          >
            {SEMESTER_LEVELS.map(
              (semester) => (
                <MenuItem
                  key={semester}
                  value={semester}
                >
                  {semester}
                </MenuItem>
              )
            )}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
}

export default AcademicFilters;