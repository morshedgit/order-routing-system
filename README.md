# order-routing-system

# Tables
```
-- Order Management Domain
CREATE TABLE Customers (
    customer_id UUID PRIMARY KEY,
    name VARCHAR(255),
    contact_details JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by UUID,
    updated_by UUID
);

CREATE TABLE OrderSpecifications (
    specifications_id UUID PRIMARY KEY,
    size VARCHAR(255),
    paper_type VARCHAR(255),
    quantity INT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by UUID,
    updated_by UUID
);

CREATE TABLE Orders (
    order_id UUID PRIMARY KEY,
    customer_id UUID REFERENCES Customers(customer_id),
    specifications_id UUID REFERENCES OrderSpecifications(specifications_id),
    status VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by UUID,
    updated_by UUID
);

-- Printer Management Domain
CREATE TABLE Locations (
    location_id UUID PRIMARY KEY,
    address TEXT,
    city VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by UUID,
    updated_by UUID
);

CREATE TABLE Printers (
    printer_id UUID PRIMARY KEY,
    name VARCHAR(255),
    location_id UUID REFERENCES Locations(location_id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by UUID,
    updated_by UUID
);

CREATE TABLE PrinterCapabilities (
    capability_id UUID PRIMARY KEY,
    printer_id UUID REFERENCES Printers(printer_id),
    print_type VARCHAR(255),
    volume_capacity INT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by UUID,
    updated_by UUID
);

-- Assignment Logic Domain
CREATE TABLE AssignmentCriteria (
    criteria_id UUID PRIMARY KEY,
    cost DECIMAL,
    quality VARCHAR(255),
    production_time INTERVAL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by UUID,
    updated_by UUID
);

CREATE TABLE Assignments (
    assignment_id UUID PRIMARY KEY,
    order_id UUID REFERENCES Orders(order_id),
    printer_id UUID REFERENCES Printers(printer_id),
    criteria_id UUID REFERENCES AssignmentCriteria(criteria_id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by UUID,
    updated_by UUID
);

-- Pricing and Cost Domain
CREATE TABLE PricingModels (
    model_id UUID PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by UUID,
    updated_by UUID
);

CREATE TABLE CostEstimates (
    estimate_id UUID PRIMARY KEY,
    order_id UUID REFERENCES Orders(order_id),
    cost DECIMAL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by UUID,
    updated_by UUID
);

-- Shipping and Logistics Domain
CREATE TABLE ShippingMethods (
    method_id UUID PRIMARY KEY,
    name VARCHAR(255),
    estimated_delivery_time INTERVAL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by UUID,
    updated_by UUID
);

CREATE TABLE Shipments (
    shipment_id UUID PRIMARY KEY,
    order_id UUID REFERENCES Orders(order_id),
    shipping_method_id UUID REFERENCES ShippingMethods(method_id),
    tracking_number VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by UUID,
    updated_by UUID
);

-- Quality Assurance Domain
CREATE TABLE Feedback (
    feedback_id UUID PRIMARY KEY,
    customer_id UUID REFERENCES Customers(customer_id),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by UUID,
    updated_by UUID
);

CREATE TABLE QualityReports (
    report_id UUID PRIMARY KEY,
    order_id UUID REFERENCES Orders(order_id),
    feedback_id UUID REFERENCES Feedback(feedback_id),
    rating INT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by UUID,
    updated_by UUID
);

-- Reporting and Analytics Domain
CREATE TABLE PerformanceReports (
    report_id UUID PRIMARY KEY,
    date DATE,
    metrics JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by UUID,
    updated_by UUID
);

CREATE TABLE AnalyticsData (
    data_id UUID PRIMARY KEY,
    type VARCHAR(255),
    value JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by UUID,
    updated_by UUID
);

-- Integration and API Domain
CREATE TABLE APIEndpoints (
    endpoint_id UUID PRIMARY KEY,
    url TEXT,
    method VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by UUID,
    updated_by UUID
);

CREATE TABLE APIRequests (
    request_id UUID PRIMARY KEY,
    endpoint_id UUID REFERENCES APIEndpoints(endpoint_id),
    payload JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by UUID,
    updated_by UUID
);
```