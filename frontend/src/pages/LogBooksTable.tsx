import { Alert, Button, Loader, Paper, Table, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { appsLogbooksLogbooksRoutesListLogbooks } from "../../generated/client";
import { Link } from "@inertiajs/react";
import { IconInfoCircle } from "@tabler/icons-react";

export default function LogBooksTable() {
  const logbooksQuery = useQuery({
    queryKey: ["logbooks"],
    queryFn: () => appsLogbooksLogbooksRoutesListLogbooks(),
  });
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Paper shadow="xs" p="xl" className="w-4xl">
        <div className="flex w-full justify-end pb-4">
          <Link
            href="logbooks/new"
            className="bg-blue-500 px-2 py-2 shadow-md text-white rounded"
          >
            Create Log Book
          </Link>
        </div>
        {logbooksQuery.isFetching ? (
          <div className="flex w-full justify-center py-24">
            <Loader />
          </div>
        ) : logbooksQuery.error ? (
          <Alert
            variant="light"
            color="red"
            title={logbooksQuery.error.name}
            icon={<IconInfoCircle />}
          >
            {logbooksQuery.error.message}
          </Alert>
        ) : logbooksQuery === null || logbooksQuery === undefined ? (
          <Alert
            variant="light"
            color="orange"
            title="Cannot load Log Books"
            icon={<IconInfoCircle />}
          >
            Sorry, we are unable to load the Log Book details. Please try again
            later
          </Alert>
        ) : (logbooksQuery.data?.data ?? []).length === 0 ? (
          <Alert
            variant="light"
            color="green"
            title="No Log Books Yet"
            icon={<IconInfoCircle />}
          >
            Hi! Start adding some LogBooks by clicking on the button on right
            above.
          </Alert>
        ) : (
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Date</Table.Th>
                <Table.Th>Driver Details</Table.Th>
                <Table.Th>Truck Details</Table.Th>
                <Table.Th>Load Details</Table.Th>
                <Table.Th></Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {(logbooksQuery?.data?.data ?? []).map((logBook) => (
                <Table.Tr>
                  <Table.Td>{logBook.start_date}</Table.Td>
                  <Table.Td>
                    <Text>Name: {logBook.driver_name}</Text>
                    <Text>Number: {logBook.driver_number}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text>Truck: {logBook.trailer_number}</Text>
                    <Text>Trailer: {logBook.trailer_number}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text>Shipper: {logBook.shipper}</Text>
                    <Text>Commodity: {logBook.commodity}</Text>
                    <Text>Load: {logBook.load_number}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Link
                      href={`/logbook/${logBook.id}`}
                      className="underline cursor-pointer"
                    >
                      View
                    </Link>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </Paper>
    </div>
  );
}
